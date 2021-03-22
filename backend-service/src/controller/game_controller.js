const Joi = require('joi');
const mongoose = require('mongoose');
const logger = require('winston');
const Game = require('../model/game');

const ScoreBoard = require('../model/scoreboard');

const requestSchema = Joi.object({
    gamePin: Joi.number().required(),
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(3).min(3),
});

exports.getGameLeaderBoard = async (req, resp) => {

    let requestBody = {};
    let leaderBoardResponse = [];

    requestBody.gamePin = req.params.gamePin;
    requestBody.page = req.query.page;
    requestBody.limit = req.query.limit;


    try {
        requestBody = await requestSchema.validateAsync(requestBody);
    } catch (ex) {
        throw ({ httpStatus: 400, message: ex.details[0].message });
    }

    const page = requestBody.page;
    const limit = requestBody.limit;

    let from = (page - 1) * limit;
    let to = (page * limit) + limit;

    const scoreboard = await ScoreBoard.findOne({ gamePin });

    if (!scoreboard) {
        logger.info(`Scoreboard with gamePin ${gamePin} does not exist`);
        throw { httpStatus: 404, message: 'Game not found' };
    }

    const scores = scoreboard.scores;

    leaderBoardResponse = scores.sort(sortScores)
        .slice(from, to)
        .map(contestant => {
            return { name: contestant.name, score: contestant.score };
        });

    return resp.send(leaderBoardResponse);

};


exports.toggleGameLock = async (req, resp) => {

    let userId = req.user.id;

    let gamePin = req.params.gamePin;

    if (!gamePin || !(gamePin > 0)) {
        logger.error('Invalid input for gamepin');
        throw { httpStatus: 400, message: 'Invalid input for gamepin' };
    }


    let game = await Game.findOne({ gamePin, hostId: userId });

    if (!game) {
        logger.error(`Game not found with pin ${gamePin} and hostId ${userId}`);
        throw { httpStatus: 400, message: 'Game not found' };
    }

    game.isGameLocked = !game.isGameLocked;

    await game.save();

    return resp.send();
}

let sortScores = (firstScore, secondScore) => {
    if (firstScore.score > secondScore.score) {
        return -1;
    } else if (firstScore.score < secondScore.score) {
        return 1;
    } else {
        return 0;
    }
}