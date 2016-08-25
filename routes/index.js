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
		res.render('index', { polls: getRows(polls),bg: bg});
	});
});

router.get('/view/:id', function(req, res, next) {
	var host = req.protocol +'://'+ req.hostname+'/'+req.params.id;
	Poll.find({_id:req.params.id},function(err,polls) {
		res.render('single',{poll:polls, bg:bg, url:host});
	});
});

router.get('/vote/:id', function(req, res) { 
	Poll.find({'answers._id':req.params.id},function(err,polls) {
	    if (err) throw err;
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		if (req.user) { var regged = polls[0].personsVoted.map(function(e) { return e.twitterID; }).indexOf(req.user.id); }
		var ipRegged = polls[0].personsVoted.map(function(e) { return e.ip; }).indexOf(ip);
	    
		if(regged == -1) {
			doVote(ip);
		} else if (ipRegged == -1) {
			doVote(ip);
		} 
		else {
			res.json({'loggedIn':true, 'error':true,'message':'You have already Voted!'});
		}
	});

	function doVote(ip) {
		var log = false;
		var query = {'answers._id': req.params.id};
		if (req.user) { var tw = req.user.id; log = true; } else { var tw = ""; log = false; }
		var update = {
			$inc: {'answers.$.votes': 1},
			$push: {'personsVoted': {'ip':ip,'twitterID':tw}}
		};
		var options = {new: true};

		Poll.update(query,update, function(err,doc) {
			if(err) throw err;
			res.json({'loggedIn':log, 'error':false});
		});
	}
});

router.get('/poll/:id', function(req, res, next) {
	Poll.find({_id:req.params.id},function(err,polls) {
		res.json(polls);
	});
});

router.get('/add', loggedIn,function(req, res, next) {
	res.render('addpoll');
});


router.post('/add', loggedIn, function(req, res, next) {
	var answer = [];
	var test = [];
	test[0] = 1111111;

	for (var i=0; i<req.body.answer.length; i++) {
		answer.push({answer: req.body.answer[i],votes: 0 });
	}
	var newPoll = Poll({
		question: req.body.question,
		answers: answer,
		created_at: new Date(),
		userID: req.user.id
	});

	newPoll.save(function (err) {
		if (err) throw err;
	});

	res.redirect('/');
});

router.get('/delete/:id', loggedIn, function(req, res, next) {
	Poll.find({_id:req.params.id}).remove(function(err,docs) {
		if (err) throw err;
		res.redirect('/profile');
	});

});


router.get('/profile', loggedIn, function(req, res) {
    Poll.find({ userID: req.user.id }).sort('-created_at').limit(6).exec(function(err, polls) {
        res.render('profile', { bg:bg, polls: getRows(polls) });
    });
});

// ----- *** Support Functions *** ---------

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

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
