'use strict';

var express = require('express');
var passport = require('passport');
var Poll = require('../models/poll.js');
var router = express.Router();

// ----- TWITT -----------------------------------------------------------------

router.get('/login',function(req, res, next) {
    res.render('login');
});

router.get('/login/twitter', passport.authenticate('twitter'));

router.get('/login/twitter/return', passport.authenticate('twitter', {
    failureRedirect: '/login'
    }), function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function (req, res,next){
      req.logOut();
      res.redirect('/');
    });

// ----- TWITT -----------------------------------------------------------------


module.exports = router;
