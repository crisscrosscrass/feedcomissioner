const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const feedsFolder = path.dirname(__dirname) + '/feeds/';
const checkfolder = require('../modules/foldercheck');
const downloadViaStream = require('../modules/downloadViaStream');
const createFileSplit = require('../modules/fileSplit');

router.get('/', (req, res) => {
    checkfolder(path.dirname(__dirname) + '/feeds/', (exist) => {
        let feedList = [];
        if (exist) {
            fs.readdirSync(feedsFolder).forEach(file => {
                if (path.extname(file) == ".csv" || path.extname(file) == ".xml") {
                    feedList.push({ file: file.trim() })
                }
            });
            res.render('filesplitter', { text: "Used to split huge Feeds", feedList }, );
        } else {
            res.render('filesplitter', { text: "Used to split huge Feeds", feedList }, );
        }
    });
})

router.post('/download_file', (req, res) => {
    console.log("=========================splitter download=================");
    var batch = req.body.amountOfBatches;
    url = req.body.fileName.replace("urlFile=", "");
    console.log(batch, url)

    async function createSplitViaDownload() {
        if (!/\.gz|\.zip/.test(url)) {
            var splittedFile = await downloadViaStream(url, feedsFolder, batch);
            console.log(splittedFile)
            detectedFile = {
                message: "created Split File via URL: " + splittedFile,
                fileName: splittedFile
            }
            res.json({ detectedFile });
        } else {
            detectedFile = {
                message: "can't stream GZIP or ZIP Files",
                fileName: "-"
            }
            res.json({ detectedFile });
        }
    }
    createSplitViaDownload()
});

router.post('/upload_file', (req, res) => {
    console.log("=========================splitter upload=================")
    detectedFile = {
        message: "splitter upload"
    }
    res.json({ detectedFile });
});

router.post('/stored_file', (req, res) => {
    console.log("=========================splitter stored=================")
    async function createSplitFromStored() {
        var splittedFile = await createFileSplit(feedsFolder, req.body.fileName, 0, req.body.amountOfBatches);
        if (splittedFile != "error") {
            detectedFile = {
                message: "created Split File via Stored Files: " + splittedFile,
                fileName: splittedFile
            }
            res.json({ detectedFile });
        } else {
            detectedFile = {
                message: "Couldn't create Split File",
                fileName: '-'
            }
            res.json({ detectedFile });
        }
    }
    createSplitFromStored()
});

module.exports = router