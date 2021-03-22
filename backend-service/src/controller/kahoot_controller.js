const Joi = require('joi');
const mongoose = require('mongoose');
const logger = require('winston');

const Collection = require('../model/collection');
const Kahoot = require('../model/kahoot');
const User = require('../model/user');


const kahootSchema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
});

const choiceSchema = Joi.array().items({
    answer: Joi.string().required(),
    correct: Joi.boolean().required()
});

const questionSchema = Joi.object().keys({
    questionNumber: Joi.number().required(),
    choices: choiceSchema.required().min(1),
    points: Joi.boolean().required(),
    pointsMultiplier: Joi.number().required(),
    question: Joi.string().required(),
    time: Joi.number().required(),
    type: Joi.string().required()
});

exports.draftKahoot = async (req, res) => {
    const userId = req.user.id;

    logger.info(`New request received to create a kahoot | userId: ${userId}`);

    let requestBody;

    logger.info('Validating request to create kahoot');
    try {
        requestBody = await kahootSchema.validateAsync(req.body);
    } catch (ex) {
        logger.error('Error in validating the request for create kahoot')
        throw ({ httpStatus: 400, message: ex.details[0].message });
    }

    const date = new Date().getTime();

    let kahoot = new Kahoot({
        title: requestBody.title,
        description: requestBody.description,
        createdBy: userId,
        createdOn: date,
        updatedBy: userId,
        updatedOn: date,
    });

    kahoot = await kahoot.save();
    logger.info(`Saved kahoot to database | kahootId: ${kahoot._id}`);

    let user = await User.findById(kahoot.createdBy);
    let kahootResponse = {
        id: kahoot._id,
        title: kahoot.title,
        description: kahoot.description,
        createdByUserId: kahoot.createdBy,
        createdByName: user.email,
        createdOn: kahoot.createdOn,
        modifiedOn: kahoot.updatedOn,
    };

    res.status(201).send(kahootResponse);
};

exports.getKahoots = async (req, res) => {
    const userId = req.user.id;

    logger.info(`New request received to get kahoots | userId: ${userId}`);

    let kahootsResponse;
    let kahoots = await Kahoot.find({ createdBy: userId, deleted: false });
    if (kahoots.length) {
        logger.info(`Kahoots obtained | userId: ${userId} | count: ${kahoots.length}`);
        let kahootsResponsePromise = kahoots.map(async kahoot => {
            let kahootResponse = await makeKahootResponse(kahoot);
            return kahootResponse;
        });
        kahootsResponse = await Promise.all(kahootsResponsePromise);
    } else {
        logger.info(`Kahoots obtained is empty | userId: ${userId}`);
        kahootsResponse = [];
    }
    res.send(kahootsResponse);
};

exports.getKahootById = async (req, res) => {
    const userId = req.user.id;

    const kahootId = req.params.id;
    logger.info(`New request received to get kahoot | kahootId: ${kahootId} | userId: ${userId}`);

    await validateKahootId(kahootId);

    let kahoot = await Kahoot.findOne({ _id: kahootId, createdBy: userId, deleted: false });
    await validateKahootAndKahootStatus(kahoot, kahootId);
    logger.info(`Kahoot obtained | kahootId: ${kahootId} | userId: ${userId}`);

    let kahootResponse = await makeKahootResponse(kahoot);
    res.send(kahootResponse);
};

exports.updateKahoot = async (req, res) => {
    const userId = req.user.id;

    const kahootId = req.params.id;
    logger.info(`New request received to update a kahoot | kahootId : ${kahootId} | userId: ${userId}`);

    let requestBody;

    logger.info('Validating request to update kahoot');
    try {
        requestBody = await kahootSchema.validateAsync(req.body);
    } catch (ex) {
        logger.error('Error in validating the request for update kahoot')
        throw ({ httpStatus: 400, message: ex.details[0].message });
    }

    await validateKahootId(kahootId);
    let kahoot = await Kahoot.findOne({ _id: kahootId, createdBy: userId, deleted: false });
    await validateKahootAndKahootStatus(kahoot, kahootId);
    logger.info(`Kahoot obtained | kahootId: ${kahootId} | userId: ${userId}`);

    const date = new Date().getTime();
    kahoot.updatedOn = date;
    kahoot.updatedBy = userId;

    kahoot.title = requestBody.title;
    kahoot.description = requestBody.description;

    kahoot = await kahoot.save();
    logger.info(`Updated Kahoot Successfully | kahootId: ${kahoot._id}`);

    let kahootResponse = await makeKahootResponse(kahoot);
    res.send(kahootResponse);
};

exports.readyKahoot = async (req, res) => {
    const userId = req.user.id;

    const kahootId = req.params.id;
    logger.info(`New request received to make kahoot ready | kahootId : ${kahootId} | userId: ${userId}`);

    await validateKahootId(kahootId);
    let kahoot = await Kahoot.findOne({ _id: kahootId, createdBy: userId, deleted: false });
    await validateKahootAndKahootStatus(kahoot, kahootId);
    logger.info(`Kahoot obtained | kahootId: ${kahootId} | userId: ${userId}`);

    const date = new Date().getTime();
    kahoot.updatedOn = date;
    kahoot.updatedBy = userId;

    kahoot.ready = true;

    kahoot = await kahoot.save();
    logger.info(`Kahoot set to ready state | kahootId: ${kahoot._id}`);

    let kahootResponse = await makeKahootResponse(kahoot);
    res.send(kahootResponse);
};

exports.addKahootToCollection = async (req, res) => {
    const userId = req.user.id;

    const kahootId = req.params.kahootId;
    const collectionId = req.params.collectionId;
    logger.info(`New request received to add kahoot to collection | kahootId: ${kahootId} | collectionId: ${collectionId} | userId: ${userId}`);

    await validateKahootId(kahootId);
    if (!mongoose.isValidObjectId(collectionId)) {
        throw ({ httpStatus: 400, message: `Invalid collectionId: ${collectionId}` });
    }

    let collection = await Collection.findOne({ _id: collectionId, createdBy: userId, deleted: false });

    if (!collection) {
        throw ({ httpStatus: 401, message: `Collection not found with id: ${collectionId}` });
    }

    let kahoot = await Kahoot.findOne({ _id: kahootId, createdBy: userId, deleted: false });
    await validateKahootAndKahootStatus(kahoot, kahootId);

    logger.info(`Kahoot obtained | kahootId: ${kahootId} | userId: ${userId}`);

    kahoot.collectionId = collectionId;
    kahoot = await kahoot.save();

    res.send({ success: true });
};

exports.deleteKahoot = async (req, res) => {
    const userId = req.user.id;

    const kahootId = req.params.id;
    logger.info(`New request received to delete kahoot | kahootId: ${kahootId} | userId: ${userId}`);

    await validateKahootId(kahootId);
    let kahoot = await Kahoot.findOne({ _id: kahootId, createdBy: userId, deleted: false });
    await validateKahootAndKahootStatus(kahoot, kahootId);

    if (kahoot.createdBy != userId)
        throw ({ httpStatus: 403, message: `Not authorised to delete the kahoot | kahootId: ${kahootId}` });

    logger.info(`Kahoot obtained | kahootId: ${kahootId} | userId: ${userId}`);

    kahoot.updatedBy = userId;
    kahoot.updatedOn = new Date().getTime();
    kahoot.deleted = true;
    kahoot = await kahoot.save();

    logger.info(`Deleted kahoot | kahootId: ${kahootId} | userId: ${userId}`);

    res.send({ success: true });
};


exports.addQuestion = async (req, res) => {
    const userId = req.user.id;

    const kahootId = req.params.id;

    logger.info(`New request received to add question | kahootId : ${kahootId} | userId: ${userId}`);

    let requestBody;

    try {
        logger.info('Validating request to add question');
        requestBody = await questionSchema.validateAsync(req.body);
        logger.info('Add question request validation success');
    } catch (ex) {
        logger.error('Error in validating the request for add question')
        throw ({ httpStatus: 400, message: ex.details[0].message });
    }

    await validateKahootId(kahootId);

    let kahoot = await Kahoot.findOne({ _id: kahootId, createdBy: userId, deleted: false });
    await validateKahootAndKahootStatus(kahoot, kahootId);
    logger.info(`Kahoot obtained | kahootId: ${kahootId} | userId: ${userId}`);

    const questionNumber = requestBody.questionNumber
    let existingQuestionWithNumber = kahoot.questions
        .find(question => question.questionNumber === questionNumber);

    if (existingQuestionWithNumber) {
        throw ({ httpStatus: 400, message: `Question with same number (${questionNumber}) exists` });
    }

    const date = new Date().getTime();
    kahoot.updatedOn = date;
    kahoot.updatedBy = userId;

    let choices = [];
    requestBody.choices.forEach(ch => {
        let choiceObject = {
            answer: ch.answer,
            correct: ch.correct,
        };
        choices.push(choiceObject);
    })

    let questionObject = {
        questionNumber: questionNumber,
        question: requestBody.question,
        choices: choices,
        points: requestBody.points,
        pointsMultiplier: requestBody.pointsMultiplier,
        time: requestBody.time,
        type: requestBody.type,
        createdOn: date,
        updatedOn: date,
    };
    kahoot.questions.push(questionObject);

    kahoot = await kahoot.save();
    logger.info(`Saved question to database | kahootId: ${kahoot._id}`);

    let kahootResponse = await makeKahootResponse(kahoot);
    res.send(kahootResponse);
};

exports.updateQuestion = async (req, res) => {
    const userId = req.user.id;

    const kahootId = req.params.kahootId;
    const questionId = req.params.questionId;

    logger.info(`New request received to update question | kahootId : ${kahootId} | questionId : ${questionId} | userId: ${userId}`);

    let requestBody;

    logger.info('Validating request to update question');
    try {
        requestBody = await questionSchema.validateAsync(req.body);
    } catch (ex) {
        logger.error('Error in validating the request for update question')
        throw ({ httpStatus: 400, message: ex.details[0].message });
    }

    await validateKahootIdAndQuestionId(kahootId, questionId);

    let kahoot = await Kahoot.findOne({ _id: kahootId, createdBy: userId, deleted: false });
    await validateKahootAndKahootStatus(kahoot, kahootId);
    logger.info(`Kahoot obtained | kahootId: ${kahootId} | userId: ${userId}`);

    const question = kahoot.questions.find(qstn => qstn._id == questionId);
    if (!question)
        throw ({ httpStatus: 404, message: `Question doesn't exist | kahootId: ${kahootId} | questionId: ${questionId}` });

    const index = kahoot.questions.indexOf(question);
    if (index > -1) {
        kahoot.questions.splice(index, 1);
    }

    const date = new Date().getTime();
    kahoot.updatedOn = date;
    kahoot.updatedBy = userId;

    let choices = [];
    requestBody.choices.forEach(ch => {
        let choiceObject = {
            answer: ch.answer,
            correct: ch.correct,
        };
        choices.push(choiceObject);
    });

    question.questionNumber = requestBody.questionNumber;
    question.question = requestBody.question;
    question.choices = choices;
    question.points = requestBody.points;
    question.pointsMultiplier = requestBody.pointsMultiplier;
    question.time = requestBody.time;
    question.type = requestBody.type;
    question.updatedOn = date;
    kahoot.questions.push(question);

    kahoot = await kahoot.save();
    logger.info(`Updated question to database | kahootId: ${kahoot._id} | questionId: ${questionId}`);

    let kahootResponse = await makeKahootResponse(kahoot);
    res.send(kahootResponse);
};


exports.deleteQuestion = async (req, res) => {
    const userId = req.user.id;

    const kahootId = req.params.kahootId;
    const questionId = req.params.questionId;

    logger.info(`New request received to delete question | kahootId : ${kahootId} | questionId : ${questionId} | userId: ${userId}`);

    await validateKahootIdAndQuestionId(kahootId, questionId);

    let kahoot = await Kahoot.findOne({ _id: kahootId, createdBy: userId, deleted: false });
    await validateKahootAndKahootStatus(kahoot, kahootId);

    logger.info(`Kahoot obtained | kahootId: ${kahootId} | userId: ${userId}`);

    const question = kahoot.questions.find(qstn => qstn._id == questionId);
    console.log("Question: " + JSON.stringify(question));
    if (!question)
        throw ({ httpStatus: 404, message: `Question doesn't exist | kahootId: ${kahootId} | questionId: ${questionId}` });

    const index = kahoot.questions.indexOf(question);
    if (index > -1) {
        kahoot.questions.splice(index, 1);
    }

    const date = new Date().getTime();
    kahoot.updatedOn = date;
    kahoot.updatedBy = userId;

    const result = await kahoot.save();
    logger.info(`Deleted question from database | kahootId: ${result._id} | questionId: ${questionId}`);

    console.log('Result: ' + JSON.stringify(result));

    let kahootResponse = await makeKahootResponse(result);
    res.send(kahootResponse);
};

async function makeKahootResponse(kahoot) {
    let user = await User.findById(kahoot.createdBy);
    let kahootResponse = {
        id: kahoot._id,
        title: kahoot.title,
        description: kahoot.description,
        questions: kahoot.questions.map(eachQuestion => {
            let questionResponse = {
                id: eachQuestion._id,
                questionNumber: eachQuestion.questionNumber,
                question: eachQuestion.question,
                type: eachQuestion.type,
                choices: eachQuestion.choices.map(eachChoice => {
                    let choiceResponse = {
                        id: eachChoice._id,
                        answer: eachChoice.answer,
                        correct: eachChoice.correct
                    };
                    return choiceResponse;
                }),
                points: eachQuestion.points,
                pointsMultiplier: eachQuestion.pointsMultiplier,
                time: eachQuestion.time,
            };
            return questionResponse;
        }),
        createdByUserId: kahoot.createdBy,
        createdByName: user.email,
        createdOn: kahoot.createdOn,
        modifiedOn: kahoot.updatedOn,
        ready: kahoot.ready,
        collectionId: kahoot.collectionId,
    };
    return kahootResponse;
};


async function validateKahootId(kahootId) {
    if (!mongoose.isValidObjectId(kahootId))
        throw ({ httpStatus: 400, message: `Invalid kahootId: ${kahootId}` });
}

async function validateKahootAndKahootStatus(kahoot, kahootId) {
    if (!kahoot) {
        throw ({ httpStatus: 404, message: `Kahoot doesn't exist | kahootId: ${kahootId}` });
    }
}

async function validateKahootIdAndQuestionId(kahootId, questionId) {
    await validateKahootId(kahootId);
    if (!mongoose.isValidObjectId(questionId))
        throw ({ httpStatus: 400, message: `Invalid questionId: ${questionId}` });
}