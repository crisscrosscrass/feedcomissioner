const express = require('express');
const router = express.Router();
var http = require('http');
var https = require('https');
const fs = require('fs');
const path = require('path');
const decompress = require('decompress');
const gunzip = require('gunzip-file');
const convert = require('xml-js');
const downloadFile = require('../modules/downloadFile');
const convertXmlToJson = require('../modules/convertXmlToJson');
const convertJsonToCsv = require('../modules/convertJsonToCsv');
const loadSyncConfig = require('../modules/loadSyncConfig');
const getSyncMapping = require('../modules/syncMapping');
const getHeadersFromCSV = require('../modules/loadHeadersFromCSV');
const getTopDelimiter = require('../modules/detectDelimiter');
const validateAllAttributesViaFeed = require('../modules/validatedElements')
const validateFileConent = require('../modules/validateFileContent')

router.get('/', (req, res) => {
    res.render('index', { text: "Used to validate big Data Feeds" });
})

router.post('/download_file', (req, res) => {
    console.log("=========================download_file=================")
    downloadFile('' + req.body.url + '', function(fileName) {
        console.log('done with loading', fileName);
        detectedFile = createResponseObject(`Your file: ${fileName} has been downloaded.`, path.extname('./feeds/' + fileName), true, fileName);
        res.json({ detectedFile });
    });
});

function createResponseObject(message = "", fileType = "", proceed = true, fileName = "") {
    detectedFile = {
        message: message,
        fileType: fileType,
        proceed: proceed,
        fileName: fileName,
    }

    return detectedFile;
}

router.post('/detect_file_type', (req, res) => {
    console.log("=========================detect_file_type=================")
    detectedFile = createResponseObject("We need to estimate File Structure", path.extname('./feeds/' + req.body.fileName), true, req.body.fileName);
    filePath = "" + path.dirname(__dirname) + '/feeds/';
    fileName = req.body.fileName;
    fileType = path.extname('./feeds/' + req.body.fileName);
    if (fileType == ".csv" || fileType == ".txt") {
        detectedFile.message = "Analyzing CSV Data"
        res.json({ detectedFile });
    } else {
        console.log("read firstline to estimate filetype");
        detectedFile.fileType = ".txt"
        res.json({ detectedFile });
    }

});

router.post('/decrompress_file', (req, res) => {
    console.log("=========================decrompress_file=================")
    detectedFile = createResponseObject("decrompress_file", path.extname('./feeds/' + req.body.fileName), true, req.body.fileName);
    filePath = "" + path.dirname(__dirname) + '/feeds/';
    fileName = req.body.fileName;
    fileType = path.extname('./feeds/' + req.body.fileName);
    console.log(req.body);
    if (fileType == ".gz") {
        newFileName = req.body.fileName.slice(0, -3);
        feedsLocation = filePath + newFileName;
        console.log("we need to decompress gz", req.body.fileName);
        gunzip(filePath + fileName, feedsLocation, () => {
            console.log('gunzip done!');
            fileType = path.extname('./feeds/' + newFileName);
            detectedFile = createResponseObject("Decompress GZ File", fileType, true, newFileName)
            console.log(detectedFile);
            res.json({ detectedFile });

        })
    } else if (fileType == ".zip") {
        decompress(filePath + fileName, path.dirname(__dirname) + '/feeds/').then(files => {
            let newFileName = req.body.fileName.slice(0, -4);
            fileType = path.extname('./feeds/' + newFileName);
            detectedFile = createResponseObject("Unpacked Zip File", fileType, true, newFileName)
            console.log("converted into", newFileName);
            res.json({ detectedFile });
        }).catch(error => console.log(error));
    } else {
        console.log("read firstline to estimate filetype");
        res.json({ detectedFile });
    }

});

router.post('/convert_xml_file', (req, res) => {
    console.log("=========================convert_xml_file=================")
    dest = "" + path.dirname(__dirname) + '/feeds/';
    fileName = req.body.fileName
    fileType = path.extname('./feeds/' + req.body.fileName);
    detectedFile = createResponseObject("Convert XML to CSV", fileType, true, fileName);

    convertXmlToJson(dest, fileName, function(fileName) {
        console.log('done XML > JSON, new file: ', fileName);
        detectedFile.fileName = fileName;
        detectedFile.fileType = path.extname('./feeds/' + fileName);
        detectedFile.message = 'Converted XML to JSON';
        console.log(detectedFile);
        res.json({ detectedFile });
    });
});

router.post('/convert_json_file', (req, res) => {
    console.log("=========================convert_json_file=================")
    dest = "" + path.dirname(__dirname) + '/feeds/';
    fileName = req.body.fileName
    fileType = path.extname('./feeds/' + req.body.fileName);
    detectedFile = createResponseObject("Convert JSON to CSV", fileType, true, fileName);

    convertJsonToCsv(dest, fileName, function(fileName, location) {
        console.log('done JSON > CSV, new file: ', fileName);
        detectedFile.fileName = fileName;
        detectedFile.fileType = path.extname('./feeds/' + fileName);
        detectedFile.message = "Converted JSON to CSV using path: " + location + '';
        console.log(detectedFile);
        res.json({ detectedFile });
    });
});

router.post('/validate_file', (req, res) => {
    console.log("=========================validate_file=================")
    dest = "" + path.dirname(__dirname) + '/feeds/';
    fileName = req.body.fileName;

    async function readAndValidate() {
        var headerValues = await getHeadersFromCSV(dest + fileName);
        var delimiter = await getTopDelimiter(headerValues);
        headerValues = headerValues.toLocaleLowerCase().split(delimiter.sign)
        fileType = path.extname('./feeds/' + req.body.fileName);
        syncMappingXMLFile = "" + path.dirname(__dirname) + '/ressources/data/SyncMapping_QM.xml';
        var mappingFile = await loadSyncConfig(syncMappingXMLFile);
        var syncMapping = await getSyncMapping(mappingFile);
        let validatedElements = await validateAllAttributesViaFeed(syncMapping, delimiter, headerValues);
        validatedElements = await validateFileConent(dest + fileName, delimiter, validatedElements)
        detectedFile = createResponseObject("Analyze CSV File", fileType, true, fileName);
        detectedFile.validatedElements = validatedElements
        res.json({ detectedFile });
        return
    }

    readAndValidate();
    // getHeadersFromCSV(dest + fileName)
    //     .then((headerValues) => {
    //         return getTopDelimiter(headerValues)
    //     })
    //     .then((data) => {
    //         console.log(data);
    //         // arrayValues = headerValues.toLocaleLowerCase().split(delimiter.sign);
    //         // console.log(headerValues);
    //         fileType = path.extname('./feeds/' + req.body.fileName);
    //         detectedFile = createResponseObject("Analyze CSV File", fileType, true, fileName);
    //         res.json({ message: "Big as hell", fileName: req.body.fileName });
    //     }).catch((error) => { console.log(error); });
    // fileType = path.extname('./feeds/' + req.body.fileName);
    // detectedFile = createResponseObject("Analyze CSV File", fileType, true, req.body.fileName);
    // res.json({ message: "Big as hell", fileName: req.body.fileName });
});

router.post('/cleaning_feeds', (req, res) => {
    console.log("=========================cleaning all files from folder feeds=================")
    deleteAllFilesFromFeeds();
    detectedFile = createResponseObject(`Your Folder is empty now`, "", true, "");
    res.json({ detectedFile });
});

function deleteAllFilesFromFeeds() {
    let directory = path.dirname(__dirname) + '/feeds/';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
}

module.exports = router