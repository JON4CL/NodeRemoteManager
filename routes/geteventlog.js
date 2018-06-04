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

function getFormatedDate(inputFormat) {
    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }
    var d = new Date();
    if (inputFormat) {
        d = new Date(inputFormat);
    }
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('');
}

router.post('/', function (req, res) {
    var startDate = getFormatedDate();
    var endDate = getFormatedDate();

    if (req.body.startDate) {
        startDate = req.body.startDate.split('/').join('-');
    }
    if (req.body.endDate) {
        endDate = req.body.endDate.split('/').join('-');
    }
    try {
        console.log(startDate);
        console.log(endDate);
        var PATH = path.join(__dirname + "\\bin", 'eventloglist.bat');
        var rc = childProcess.execFileSync(PATH, [startDate, endDate]).toString('ascii');
        console.log(rc.length);
        res.send(rc);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

module.exports = router;