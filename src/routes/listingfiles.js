const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const feedsFolder = path.dirname(__dirname) + '/feeds/';
const checkfolder = require('../modules/foldercheck');

router.get('/', (req, res) => {
    checkfolder(path.dirname(__dirname) + '/feeds/', (exist) => {
        let feedList = [];
        if (exist) {
            fs.readdirSync(feedsFolder).forEach(file => {
                feedList.push({ file: file, size: getFilesizeInBytes(file) })
                    // console.log(file, getFilesizeInBytes(file));
            });
            res.render('listingfiles', { text: "All stored Files", feedList }, );
        } else {
            res.render('listingfiles', { text: "All stored Files", feedList }, );
        }
    });
});
router.get('/:filename', (req, res) => {
    let feedList = [];
    fs.readdirSync(feedsFolder).forEach(file => {
        feedList.push({ file: file, size: getFilesizeInBytes(file) })
            // console.log(file, getFilesizeInBytes(file));
    });
    // console.log(feedList);
    console.log("your requested: ", req.params.filename);
    // res.render('listingFiles', { text: "All stored Files", feedList }, );
    // console.log(path.dirname(__dirname) + '/feeds/' + req.params.filename);
    // mimeType = "application/force-download"
    // res.setHeader('content-type', mimeType);
    // res.sendFile(path.dirname(__dirname) + '/feeds/' + req.params.filename, err => console.log(err));
    var file = req.params.filename;
    var fileLocation = path.dirname(__dirname) + '/feeds/' + file;
    res.download(fileLocation);
})

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(feedsFolder + filename)
    var fileSizeInBytes = stats["size"]
    return fileSizeInBytes / 1000000.0 + " MB";
}

module.exports = router