'use strict';

var express     = require('express');
var bodyParser  = require('body-parser')
var mongoose    = require('mongoose');
var passport    = require('passport');
var Strategy    = require('passport-twitter').Strategy;
var routes      = require('./routes/index.js');
var user      = require('./routes/user.js');
require('dotenv').config();

passport.use(new Strategy({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callbackURL: process.env.CALLBACK_URI
  },
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


var port = process.env.PORT || 4000;
var app = express();

mongoose.connect(process.env.MONGOLAB_URI);

app.set('views', process.cwd() + '/views');
app.set('view engine', 'pug');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use('/public', express.static(process.cwd() + '/public'));

app.use(passport.initialize());
app.use(passport.session());            // must be before Routes!!!!!!

app.use(function(req, res, next) {      // send req.user to all routes
  res.locals.user = req.user;
  next();
});

app.use('/', routes);
app.use('/', user);


app.listen(port,function () {
    console.log('Express running on port ' + port);
});
