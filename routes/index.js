'use strict';

var express 	= require('express');
var passport    = require('passport');
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
	Poll.find({}).sort('-created_at').limit(6).exec(function(err,polls) {
		res.render('index', { polls: getRows(polls),bg: bg, user: req.user });
	});
});

router.get('/view/:id', function(req, res, next) {
	Poll.find({_id:req.params.id},function(err,polls) {
		res.render('single',{poll:polls, bg:bg});
	});
});

router.get('/vote/:id', function(req, res, next) {
	var query = {'answers._id': req.params.id};
	var update = {$inc: {'answers.$.votes': 1}};
	var options = {new: true};

	Poll.update(query,update, function(err,doc) {
		if(err) throw err;
		//console.log(doc);
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


// ----- TWITT -----------------------------------------------------------------
/*
router.get('/login',
  function(req, res){
    res.render('login');
  });
*/
router.get('/login/twitter',
  passport.authenticate('twitter'));

router.get('/login/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });


// ----- TWITT -----------------------------------------------------------------



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
