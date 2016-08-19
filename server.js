'use strict';

var express     = require('express');
var bodyParser = require('body-parser')
var mongoose    = require('mongoose');
var routes      = require('./routes/index.js');

require('dotenv').config();

var port = process.env.PORT || 4000;
var app = express();

mongoose.connect(process.env.MONGOLAB_URI);

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', process.cwd() + '/views');
app.set('view engine', 'pug');
app.use('/', routes);


app.listen(port,function () {
    console.log('Express running on port ' + port);
});
