/*global __dirname */
'use strict';
// Execute child proccess in the OS
const childProcess = require('child_process');
// Simplify path operations
const path = require('path');
// add express module
var express = require('express');
// create a router
var router = express.Router();

function screenshot(req, res)
{
    var width = req.query.WIDTH;
    var params = "-wr" + width;
    
    var PATH = path.join(__dirname + "\\bin", "screenshot.bat");
    var rc = childProcess.execFileSync(PATH, [params]).toString('ascii');
    res.send(rc);
}

function livescreen(req, res)
{

    var PATH = path.join(__dirname + "\\bin", "screenshot.bat");
    var rc = childProcess.execFileSync(PATH).toString('ascii');
    res.send(rc);
}

router.get('/', function (req, res) {
    console.log(req.query);
    try {
        if (req.query.TYPE == "SCREENSHOT")
        {
            screenshot(req, res);
        } 
        else if (req.query.TYPE == "LIVESCREEN")
        {
            livescreen(req, res);
        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

module.exports = router;