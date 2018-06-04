/*global __dirname */
// list windows event log between the range of dates
'use strict';
// Execute child proccess in the OS
const childProcess = require('child_process');
// Simplify path operations
const path = require('path');
// add express module
var express = require('express');
// create a router
var router = express.Router();

router.get('/', function (req, res) {
    try {
        var PATH = path.join(__dirname + "\\bin", "getstatus.bat");
        var rc = childProcess.execFileSync(PATH).toString('ascii');
        res.send(rc);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});


module.exports = router;