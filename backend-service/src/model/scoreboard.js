const mongoose = require('mongoose');

const scoreSchema = mongoose.Schema({
    connectionId: { type: String, required: true },
    name: { type: String, required: true },
    score: { type: Number, default: 0, required: true }
});

const scoreBoardSchema = mongoose.Schema({
    gamePin: { type: Number, required: true },
    scores: [scoreSchema]
});

const ScoreBoard = mongoose.model('scoreBoards', scoreBoardSchema);

module.exports = ScoreBoard