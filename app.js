/* global __dirname */
// ----------------------------------------------------------------------------
// IMPORTS
// ----------------------------------------------------------------------------
// add express module
var express = require('express');
//var path = require('path');
//var favicon = require('serve-favicon');
// log requests to the console (express4)
var morgan = require('morgan');
//var cookieParser = require('cookie-parser');
// pull information from HTML POST (express4)
var bodyParser = require('body-parser');
// simulate DELETE and PUT (express4)
var methodOverride = require('method-override');
// file system access
//var fs = require("fs");
// list all drives availables in the computer
//var drive = require('ja-filelist');
var multer = require('multer');
// ----------------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------------
// create express app
var app = express();
// set the static files location
app.use(express.static(__dirname + '/public'));
// log every request to the console
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended':'true'}));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// set simulator for DELETE and PUT
app.use(methodOverride());
// NEEDED FOR MULTER
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// ----------------------------------------------------------------------------
// ROUTES
// ----------------------------------------------------------------------------
var getdrives = require('./routes/getdrives');
var listfiles = require('./routes/listfiles');
var getfile = require('./routes/getfile');
var geteventlog = require('./routes/geteventlog');
var uploadfile = require('./routes/uploadfile');
var getstatus = require('./routes/getstatus');
var screenshot = require('./routes/screenshot');
var index = require('./routes/index');

// get all drives availables in the computer
app.use('/api/getdrives', getdrives);
// get all files and folders available in the directory
app.use('/api/listfiles', listfiles);
// get a file in the specified directory
app.use('/api/getfile', getfile);
// upload file(s) in the specified directory
app.use('/api/uploadfile', uploadfile);
// get event log from the machine
app.use('/api/geteventlog', geteventlog);
// get event log from the machine
app.use('/api/getstatus', getstatus);
// get screenshot from the machine
app.use('/api/screenshot', screenshot);
// get the main page
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
