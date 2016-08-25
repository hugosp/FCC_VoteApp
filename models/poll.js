var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
    question: String,
    answers: [{
        answer: String,
        votes: Number
    }],
    ip: String,
    userID: String,
    created_at: Date,
    personsVoted: [
        { twitterID:String }
    ]
});

var Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
