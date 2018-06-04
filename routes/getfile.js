// file system access
var fs = require("fs");
// add express module
var express = require('express');
// create a router
var router = express.Router();

router.get('/', function (req, res, next) {
    var file;
    var fullFileName;
    var fileName;
    var file;
    var stat;

    try {
        fullFileName = req.query.Path;
        fileName = fullFileName.substring(fullFileName.lastIndexOf("\\") + 1);
        file = fs.readFileSync(fullFileName);
        stat = fs.statSync(fullFileName);

        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename="' + fileName + '"');
        res.write(file, 'binary');
        res.end();
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;