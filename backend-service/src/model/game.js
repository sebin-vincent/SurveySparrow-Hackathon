const mongoose = require('mongoose');


const ContestantSchema = mongoose.Schema({
    connectionId: { type: String, required: true },
    name: { type: String, required: true },

})

const gameSchema = mongoose.Schema({
    gamePin: { type: Number, required: true },
    hostConnectionId: { type: String },
    hostId: { type: mongoose.Schema.Types.ObjectId, required: true },
    kahootId: { type: mongoose.Schema.Types.ObjectId, required: true },
    currentQuestion: { type: Number, required: true },
    isCurrentQuestionActive: { type: Boolean, default: false },
    isGameLocked: { type: Boolean, default: false },
    isStarted: { type: Boolean, default: false },
    contestants: [ContestantSchema],
    startedOn: { type: Number, default: Date.now, required: true },
});

const Game = mongoose.model('games', gameSchema);

module.exports = Game;