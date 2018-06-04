/* global __dirname */

// add express module
var express = require('express');
// create a router
var router = express.Router();

router.get('/', function(req, res, next) {
    res.sendFile('index.html', { root: __dirname + '\\public' });
});

module.exports = router;