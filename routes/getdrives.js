/*global __dirname */
// list all drives availables in the computer
'use strict';
// Execute child proccess in the OS
const childProcess = require('child_process');
// Simplify path operations
const path = require('path');
// add express module
var express = require('express');
// create a router
var router = express.Router();

router.post('/', function (req, res, next) {
    try {
        var PATH = path.join(__dirname + "\\bin", 'drivelist.bat');
        var rc = childProcess.execFileSync(PATH).toString('ascii');
        res.send(rc);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;