const mongoose = require('mongoose');

const choiceSchema = mongoose.Schema({
    answer: { type: String, required: true },
    correct: { type: Boolean, default: false, required: true }
});

const questionSchema = mongoose.Schema({
    questionNumber: { type: Number, default: true },
    choices: [choiceSchema],
    image: { type: String, required: false },
    points: { type: Boolean, required: true },
    pointsMultiplier: { type: Number, required: true },
    question: { type: String, required: true },
    time: { type: Number, default: 30000, required: true },
    type: { type: String, required: true },
    createdOn: { type: Number, default: Date.now, required: true },
    updatedOn: { type: Number, default: Date.now, required: true },
});

const kahootSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdOn: { type: Number, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    updatedOn: { type: Number, default: Date.now, required: true },
    questions: [questionSchema],
    collectionId: { type: mongoose.Schema.Types.ObjectId, required: false },
    deleted: { type: Boolean, default: false, required: true },
    ready: { type: Boolean, default: false }
});

const Kahoot = mongoose.model('kahoots', kahootSchema);

module.exports = Kahoot;