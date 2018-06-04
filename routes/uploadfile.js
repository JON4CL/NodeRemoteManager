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
// add support for file upload
var multer = require('multer');

// MULTER diskstorage configuration
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

// MULTER configuration
var upload = multer({
    storage: storage
}).single('file');

// ROUTE configuration
router.post('/', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        var fileSrc = __dirname + "\\..\\" + req.file.path;
        var fileDst = req.query.finalPath + req.file.originalname;
        try {
            var PATH = path.join(__dirname + "\\bin", 'movefile.bat');
            var rc = childProcess.execFileSync(PATH, [fileSrc, fileDst]).toString('ascii');
            res.send(rc);
        } catch (e) {
            res.status(400).send(e);
        }
    });
});

module.exports = router;