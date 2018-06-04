/*global __dirname */
// list all drives availables in the computer
'use strict';
// Execute child proccess in the OS
const childProcess = require('child_process');
// Simplify path operations
const path = require('path');
//// add express module
var express = require('express');
// create a router
var router = express.Router();

router.post('/', function(req, res) {
    var dirPath = "";
    var listFolders = "Y";
    var listFiles = "Y";
    if (req.body.Path) {
        dirPath = req.body.Path;
        if (req.body.Folders) {
            listFolders = req.body.Folders;
        }
        if (req.body.Files) {
            listFiles = req.body.Files;
        }
        try {
            var PATH = path.join(__dirname + "\\bin", 'filelist.bat');
            var rc = childProcess.execFileSync(PATH, [dirPath, listFolders, listFiles]).toString('ascii');
            res.send(rc);
        } catch (e) {
            res.status(400).send(e);
        }
    } else {
        res.status(400).send("NO SE ENVIO DIRECTORIO");
    }
});

module.exports = router;