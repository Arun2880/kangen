const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title1: {
        type: String,
        required: true
    },
    deatils1: {
        type: String,
        required: true
    },
    title2: {
        type: String
    },
    deatils2: {
        type: String
    },
    deatils3: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model('Blog', BlogSchema);
