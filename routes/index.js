'use strict';

var express 	= require('express');
var Poll        = require('../models/poll.js');
var router 		= express.Router();

var bg =  [
	'rgba(217, 102, 102, 0.9)',
	'rgba(129, 172, 139, 0.9)',
	'rgba(242, 229, 162, 0.9)',
	'rgba(248, 152, 131, 0.9)',
	'rgba(153, 102, 255, 0.9)',
	'rgba(255, 159, 64, 0.9)'
];

router.get('/', function(req, res, next) {
	Poll.find({},function(err,polls) {
		res.render('index', { polls: getRows(polls),bg: bg });
	});
});

router.get('/vote/:id/:ans', function(req, res, next) {
	var query = {'answers._id': req.params.id};
	var update = {$inc: {'answers.$.votes': 1}};
	var options = {new: true};

	Poll.update(query,update, function(err,doc) {
		if(err) throw err;
		console.log(doc);
		res.send(doc);
	});
});



router.get('/poll/:id', function(req, res, next) {
	Poll.find({_id:req.params.id},function(err,polls) {
		res.json(polls);
	});
});

router.get('/add', function(req, res, next) {
	res.render('addpoll');
});


router.post('/add', function(req, res, next) {
	var answer =[];
	for (var i=0; i<req.body.answer.length; i++) {
		answer.push({answer: req.body.answer[i],votes: 0 });
	}
	console.log(req.body.answer);
	var newPoll = Poll({
		question: req.body.question,
		answers: answer,
		created_at: new Date()
	});

	newPoll.save(function (err) {
		if (err) throw err;
	});

	res.redirect('/');
});


function getRows(items) {
    return items.reduce(function (prev, item, i) {
        if(i % 3 === 0)
            prev.push([item]);
        else
            prev[prev.length - 1].push(item);
        return prev;
    }, []);
}



module.exports = router;
