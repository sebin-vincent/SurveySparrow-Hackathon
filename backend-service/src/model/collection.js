const mongoose = require('mongoose');

const collectionSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdOn: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    updatedOn: { type: Date, required: true },
    enabled: { type: Boolean, default: true, required: true },
    deleted: { type: Boolean, default: false, required: true }
});

const Collection = mongoose.model('collections', collectionSchema);

module.exports = Collection;