'use strict';

var express 	= require('express');
var passport    = require('passport');
//var Poll        = require('../models/poll.js');
var router 		= express.Router();

// ----- TWITT -----------------------------------------------------------------


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


module.exports = router;
