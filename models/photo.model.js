const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const photoSchema = new Schema({
    photoID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    altDescription: {
        type: String,
        required: true
    },
    urlsSmall: {
        type: String,
        required: true
    },
    urlsRegular: {
        type: String,
        required: true
    },
    urlsThumb: {
        type: String,
        required: true
    },
    urlsRaw: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo;