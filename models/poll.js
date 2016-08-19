var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
    question: String,
    answers: [{
        answer: String,
        votes: Number
    }],
    ip: String,
    created_at: Date,
    updated_at: Date
});

var Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
