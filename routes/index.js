'use strict';

var express 	= require('express');
var Poll        = require('../models/poll.js');
var router 		= express.Router();


router.get('/', function(req, res, next) {
	Poll.find({},function(err,polls) {
		res.render('index', { polls: polls });
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
	for() // here be scanning answers typ...
	var newPoll = Poll({
		question: req.body.question,
		answers: [{answer: req.body.answer1, votes:0},{answer: req.body.answer2, votes:0}],
		created_at: new Date()
	});

	newPoll.save(function (err) {
		if (err) throw err;
	});

	res.redirect('/');
});


module.exports = router;
