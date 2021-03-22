const logger = require('winston');
const jwt = require('jsonwebtoken');

const authSetup = require('../startup/auth_setup');
const Game = require('../model/game');
const ScoreBoard = require('../model/scoreboard');
const Kahoot = require('../model/kahoot');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

let PUBLIC_KEY;

const setupPublicKey = async () => {
    PUBLIC_KEY = await authSetup.readPublicKey();
}

exports.initialize = (io) => {

    if (!PUBLIC_KEY) {
        setupPublicKey();
    }

    io.on('connection', (socket) => {
        logger.info(`New connection established with id ${socket.id}`);

        socket.on('CREATE_GAME', async (room) => await createGame(socket, room));

        socket.on('JOIN_GAME', async (contestant) => await joinGame(io, socket, contestant));

        socket.on('START_GAME', async (gameRequest) => await startGame(io, socket, gameRequest));

        socket.on('NEXT_QUESTION', async (gamePin) => await nextQuestion(io, socket, gamePin));

        socket.on('SUBMIT_ANSWER', async (answer) => await submitAnswer(io, socket, answer));

        socket.on('disconnect', () => {
            logger.info(`Connection with id ${socket.id}  has been disconected`);
        });
    });

};

const roomSchema = Joi.object().keys({
    token: Joi.string().required(),
    kahootId: Joi.objectId().required()
});

const contestantSchema = Joi.object().keys({
    gamePin: Joi.number().required(),
    name: Joi.string().required()
});

const answerSchema = Joi.object().keys({
    gamePin: Joi.number().required(),
    choice: Joi.number().required().min(0).max(3),
    timeLag: Joi.number().required()
});

const gameRequestSchema = Joi.object().keys({
    gamePin: Joi.number().required(),

});


const createGame = async (socket, room) => { //Called by host

    let hostId;

    try {

        try {
            await roomSchema.validateAsync(room);
        } catch (ex) {
            logger.error(ex.details[0].message);
            socket.emit('CREATED_GAME', { status: false, message: ex.details[0].message });
            socket.disconnect();
            return;
        }

        let token = room.token;
        try {
            hostId = verifyUser(token);
        } catch (ex) {
            logger.info(JSON.stringify(ex));
            socket.emit('CREATED_GAME', { status: false, message: "Token couldn't be verified." });
            socket.disconnect();
            return;
        }
        if (!hostId) {
            socket.emit('CREATED_GAME', { status: false, message: "Token couldn't be verified." });
            socket.disconnect();
            return;
        }

        let kahootId = room.kahootId;

        logger.info(`Request to Create game from host ${hostId} for kahoot ${kahootId}`);


        const kahoot = await Kahoot.findById(kahootId);

        if (!kahoot || kahoot.createdBy != hostId) {
            socket.emit('CREATED_GAME', { status: false, message: "Kahoot not found." });
            socket.disconnect();
            return;
        }

        let gamePin = generateGamePin();

        logger.info(`Gamepin generated ${gamePin}`);

        const game = new Game({
            gamePin,
            hostConnectionId: socket.id,
            hostId,
            kahootId,
            currentQuestion: 1,
            isCurrentQuestionActive: false,
            isStarted: false,
            isGameLocked: false,
            contestants: []
        });
        await game.save();

        let scoreboard = new ScoreBoard({
            gamePin,
            scores: []
        });


        await scoreboard.save();

        socket.emit('CREATED_GAME', { status: true, pin: gamePin });
    } catch (ex) {
        logger.error(JSON.stringify(ex));
        socket.emit('CREATED_GAME', { status: false, message: "Something went wrong." });
        socket.disconnect();
    }

};

const joinGame = async (io, socket, contestant) => { //Called by player

    try {

        try {
            await contestantSchema.validateAsync(contestant);
        } catch (ex) {
            logger.error(ex.details[0].message);
            socket.emit("JOINED_GAME", { status: false, message: ex.details[0].message });
            socket.disconnect();
            return;
        }

        const connectionId = socket.id;
        const gamePin = contestant.gamePin;
        const name = contestant.name;
        logger.info(`Request to join game room ${gamePin} from player with id ${connectionId}`);

        const game = await Game.findOne({ gamePin });
        const scoreboard = await ScoreBoard.findOne({ gamePin });


        if (game && !game.isGameLocked) {
            let hostConnectionId = game.hostConnectionId;

            let existingContestants = game.contestants
                .filter(contestant => contestant.connectionId == connectionId);

            if (existingContestants.length > 0) {
                logger.error(`Connection with id ${connectionId} already joined game`);
                socket.emit('JOINED_GAME', { status: false, message: "Already joined game." });
                return;
            }

            existingContestants = game.contestants
                .filter(contestant => contestant.name == name);

            if (existingContestants.length > 0) {
                logger.info(`${name} has already taken`);
                socket.emit('JOINED_GAME', { status: false, message: "Name already taken. Choose different name" });
                return;
            }

            logger.info(`Connection id ${socket.id} joining to room ${gamePin}`)
            socket.join(gamePin);
            let newContestant = {
                connectionId,
                name
            };

            let newScoreBoardEntry = {
                connectionId,
                name,
                score: 0
            };
            game.contestants.push(newContestant);
            scoreboard.scores.push(newScoreBoardEntry);
            await game.save();
            await scoreboard.save();

            logger.info(`Game joined. Emitting events`);
            socket.emit('JOINED_GAME', { status: true, message: "Successfully joined game" });
            io.to(hostConnectionId).emit("JOINED_GAME", { status: true, name });
        } else {
            logger.error(`Game with pin ${gamePin} and not found`);
            socket.emit('JOINED_GAME', { status: false, message: "Game not found." });
            socket.disconnect();
        }
    } catch (ex) {
        logger.error(`Execption occured.`);
        logger.error(JSON.stringify(ex));
        socket.emit('JOINED_GAME', { status: false, message: "Something went wrong" });
        socket.disconnect();
        return;
    }

}


const startGame = async (io, socket, gameRequest) => {

    try {
        await gameRequestSchema.validateAsync();
    } catch (ex) {
        logger.error(ex.details[0].message);
        socket.emit('STARTED_GAME', { status: false, message: ex.details[0].message });
        socket.disconnect();
        return;
    }

    let gamePin = gameRequest.gamePin;
    logger.info(`Request to start game with gamepin: ${gamePin}`);


    const game = await Game.findOne({ gamePin });

    if (!game || game.hostConnectionId != socket.id) {
        logger.error('Game not found with id');
        socket.emit('STARTED_GAME', { status: false, message: 'Game not found' });
        return;
    }

    const kahoot = await Kahoot.findById(game.kahootId);

    const questions = kahoot.questions;

    const currentQuestion = questions.find(question => question.questionNumber == 1);
    let timeOut = currentQuestion.time;

    let isLastQuestion = questions.find(question => question.questionNumber == 2) ? false : true;

    let questionResponseForHost = makeQuestionResponse(currentQuestion);
    questionResponseForHost.isLastQuestion = isLastQuestion;

    let questionResponseForClient = {
        choices: currentQuestion.choices.length,
        timeOut,
        isLastQuestion
    }
    logger.info('Triggering time out');

    io.to(socket.id).emit("STARTED_GAME", { status: true, timer: 5 });
    io.to(gamePin).emit("STARTED_GAME", { status: true, timer: 5 });

    setTimeout(async () => {
        game.isStarted = true;
        game.isCurrentQuestionActive = true;
        await game.save();
        socket.emit('NEW_QUESTION', { status: true, questionResponseForHost });
        io.to(gamePin).emit('NEW_QUESTION', { status: true, questionResponseForClient });
        setTimeout(async () => await deactivateCurrentQuestion(game), timeOut * 1000);
    }, 5000);

}

const nextQuestion = async (io, socket, gameRequest) => {


    try {
        await gameRequestSchema.validateAsync();
    } catch (ex) {
        logger.error(ex.details[0].message);
        socket.emit('NEXT_QUESTION_ACTIVATED', { status: false, message: ex.details[0].message });
        socket.disconnect();
        return;
    }

    let gamePin = gameRequest.gamePin;
    logger.info(`Request to start game with gamepin: ${gamePin}`);

    const game = await Game.findOne({ gamePin });

    if (!game || game.hostConnectionId != socket.id) {
        logger.error('Game not found with id');
        socket.emit('NEXT_QUESTION_ACTIVATED', { status: false, message: 'Game not found with id' });
        return;
    }

    const kahoot = await Kahoot.findById(game.kahootId);

    const questions = kahoot.questions;

    let currentQuestionNumber = game.currentQuestion;

    const currentQuestion = questions.find(question => question.questionNumber == currentQuestionNumber);
    let timeOut = currentQuestion.time;

    let isLastQuestion = questions.find(question => question.questionNumber == currentQuestionNumber + 1) ? true : false;

    let questionResponseForHost = makeQuestionResponse(currentQuestion);
    questionResponseForHost.isLastQuestion = isLastQuestion;

    let questionResponseForClient = {
        choices: currentQuestion.choices.length,
        timeOut,
        isLastQuestion
    }

    io.to(socket.id).to(gamePin).emit("NEXT_QUESTION_ACTIVATED", { status: true, timer: 5 });

    setTimeout(async () => {
        game.isStarted = true;
        game.isCurrentQuestionActive = true;
        await game.save();
        socket.emit('NEW_QUESTION', questionResponseForHost);
        io.to(gamePin).emit('NEW_QUESTION', questionResponseForClient);
        setTimeout(async () => await deactivateCurrentQuestion(game), timeOut * 1000);
    }, 5000);

}

const submitAnswer = async (io, socket, answer) => {

    try {
        await answerSchema.validateAsync(answer);
    } catch (ex) {
        logger.error(ex.details[0].message);
        socket.emit("ANSWER_SUBMITED", { status: false, message: ex.details[0].message });
        socket.disconnect();
        return;
    }

    let gamePin = answer.gamePin;

    const game = await Game.findOne({ gamePin });

    if (!game) {
        logger.error(`Game with pin ${gamePin} not found`);
        socket.emit("ANSWER_SUBMITED", { status: false, message: 'Game not found' });
        return;
    }

    if (!game.isCurrentQuestionActive) {
        logger.info('Question timeout');
        socket.emit("ANSWER_SUBMITED", { status: false, message: 'Question timeout' });
        return;
    }

    const contestantId = socket.id;
    const hostConnectionId = game.hostConnectionId;
    const kahootId = game.kahootId;
    let currentQuestionNumber = game.currentQuestion;

    socket.emit('ANSWER_SUBMITTED', { status: true });
    io.to(hostConnectionId).emit('ANSWER_SUBMITTED', { status: true, answer: answer.choice });

    const kahoot = Kahoot.findById(kahootId);

    const question = kahoot.questions.find(question => question.questionNumber == currentQuestionNumber);

    if (question.choices[answer.choice].correct) {
        //getTimeDifference
        let answerTimeLag = answer.timeLag;
        logger.info(`Timelag for submission is ${answerTimeLag}`);
        let score = answerTimeLag * 70 * question.pointsMultiplier;//calculate score

        const scoreboard = ScoreBoard.findOne({ gamePin });

        const participant = ScoreBoard.scores(score => score.connectionId == contestantId);
        participant.score = score;
        await scoreboard.save();
    }
}


const generateGamePin = () => {
    logger.info('Generating game pin');
    return Math.floor(100000 + Math.random() * 900000);
}

const verifyUser = (token) => {
    try {
        let payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
        return payload.id;
    } catch (ex) {
        logger.error('Exception occured while verifying user.');
        logger.error(JSON.stringify(ex));
        return null;
    }
}

const deactivateCurrentQuestion = async (game) => {
    game.isCurrentQuestionActive = false;
    game.currentQuestion = game.currentQuestion + 1;
    await game.save();
}

const makeQuestionResponse = (question) => {

    const questionResponse = {};

    questionResponse.questionBody = question.question;
    questionResponse.image = question.image;
    questionResponse.type = question.type;
    questionResponse.options = question.choices.map(choice => choice.answer);
    questionResponse.time = question.time;

    return questionResponse;
};
