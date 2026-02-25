const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
        _id: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: false, timestamps: false }
);

module.exports = mongoose.model('Session', sessionSchema);
