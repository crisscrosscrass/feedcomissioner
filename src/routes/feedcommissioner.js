const express = require('express');
const router = express.Router();
var http = require('http');
var https = require('https');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const decompress = require('decompress');
const gunzip = require('gunzip-file');
const convert = require('xml-js');
const downloadFile = require('../modules/downloadFile');
const checkfolder = require('../modules/foldercheck');
const convertXmlToJson = require('../modules/convertXmlToJson');
const convertJsonToCsv = require('../modules/convertJsonToCsv');
const loadSyncConfig = require('../modules/loadSyncConfig');
const getSyncMapping = require('../modules/syncMapping');
const getHeadersFromCSV = require('../modules/loadHeadersFromCSV');
const getTopSeparator = require('../modules/detectDelimiter');
const validateAllAttributesViaFeed = require('../modules/validatedElements')
const validateFileConent = require('../modules/validateFileContent')
const getXMLHeadersFromFile = require('../modules/getHeaderFromXML');
const convertBigXMLToCSV = require('../modules/convertBigXMLToCSV');
const detectXMLNodes = require('../modules/detectXMLNodes');

String.prototype.removeDelimiter = function() {
    return this.replace(/\"/g, "").replace(/\'/g, "");
};

router.get('/', (req, res) => {
    var io = req.app.get('socketio');
    io.on('connection', function(socket) {
        console.log("Made Socket connection!", socket.id);

        socket.on('progress', (data) => {
            console.log(data)
            io.sockets.emit('progress', data)
        })
    })
    res.render('index', { text: "Used to validate big Data Feeds" });
})

router.post('/download_file', (req, res) => {
    console.log("=========================download_file=================")
    const io = req.app.get('socketio');
    checkfolder(path.dirname(__dirname) + '/feeds/', (exist) => {
        if (exist) {
            if (req.body.url.length > 5) {
                downloadFile('' + req.body.url + '', io, function(fileName) {
                    console.log('done with loading', fileName);
                    if (!fs.statSync(path.dirname(__dirname) + '/feeds/' + fileName).size < 1) {
                        detectedFile = createResponseObject(`Your file: ${fileName} has been loaded.`, path.extname('./feeds/' + fileName), true, fileName);
                        res.json({ detectedFile });
                    } else {
                        detectedFile = createResponseObject(`File ${fileName} can't be empty, might be blocked from downloading`, "", false, "");
                        res.json({ detectedFile });
                    }
                });
            } else {
                detectedFile = createResponseObject(`URL needs to be valid`, "", false, "");
                res.json({ detectedFile });
            }
        } else {
            detectedFile = createResponseObject(`Folder needs to be created first`, "", false, "");
            res.json({ detectedFile });
        }
    });
});

router.post('/upload_file', (req, res) => {
    console.log("=========================upload_file=================")
    checkfolder(path.dirname(__dirname) + '/feeds/', (exist) => {
        if (exist) {
            var form = new formidable.IncomingForm();
            form.maxFileSize = 2000000000;
            form.parse(req);
            form.on('fileBegin', function(name, file) {
                file.path = path.dirname(__dirname) + '/feeds/' + file.name;
            });
            form.on('data', function(res) {
                //console.log(res);
                received_bytes += res.length;

                showProgress(received_bytes, total_bytes);
                // console.log(res.headers['content-length']);
            })
            form.on('file', function(name, file) {
                console.log('Uploaded ' + file.name);
                detectedFile = createResponseObject(`File ${file.name} has been uploaded`, path.extname('./feeds/' + file.name), true, file.name);
                res.json({ detectedFile });
            });
        }
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
    } else if (fileType == ".xml" || fileType == ".gz" || fileType == ".zip" || fileType == ".json") {
        detectedFile.message = "detection from stored files"
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
    try {
        convertXmlToJson(dest, fileName, function(fileName) {
            console.log('done XML > JSON, new file: ', fileName);
            detectedFile.fileName = fileName;
            detectedFile.fileType = path.extname('./feeds/' + fileName);
            detectedFile.message = 'Converted XML to JSON';
            console.log(detectedFile);
            res.json({ detectedFile });
        });
    } catch (error) {
        if (error.code == "ERR_STRING_TOO_LONG") {
            console.log("Feed too big");
            async function bigXMLToCSV() {
                elementNode = await detectXMLNodes(dest, fileName);
                console.log(elementNode)
                if (elementNode != "unknown") {
                    var header = await getXMLHeadersFromFile(dest + fileName);
                    var file = await convertBigXMLToCSV(dest, fileName, header, elementNode);
                    detectedFile = createResponseObject("Convert XML to <strong>smaller CSV File </strong> due size and time", path.extname('./feeds/' + file), true, file)
                    console.log("converted into", file);
                    res.json({ detectedFile });
                } else {
                    detectedFile = createResponseObject(`Can't find Item nodes in ${fileName} , unable to process from here`, "", false, "");
                    res.json({ detectedFile });
                }
            }
            bigXMLToCSV();
        }
    }
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
        headerValues = headerValues.removeDelimiter();
        var separator = await getTopSeparator(headerValues);
        headerValues = headerValues.toLocaleLowerCase().split(separator.sign)
        fileType = path.extname('./feeds/' + req.body.fileName);
        syncMappingXMLFile = "" + path.dirname(__dirname) + '/ressources/data/SyncMapping_QM.xml';
        var mappingFile = await loadSyncConfig(syncMappingXMLFile);
        var syncMapping = await getSyncMapping(mappingFile);
        let validatedElements = await validateAllAttributesViaFeed(syncMapping, separator, headerValues);
        validatedElements = await validateFileConent(dest + fileName, separator, validatedElements)
        detectedFile = createResponseObject("Analyze CSV File : " + fileName, fileType, true, fileName);
        detectedFile.validatedElements = validatedElements

        return res.json({ detectedFile });
    }

    readAndValidate();
});

router.post('/cleaning_feeds', (req, res) => {
    console.log("=========================cleaning all files from folder feeds=================")
    deleteAllFilesFromFeeds();
    detectedFile = createResponseObject(`Your Online Folder is empty now`, "", true, "");
    res.json({ detectedFile });
});



router.post('/:filename', (req, res) => {
    console.log("you have created a post request")
        // res.render('index', { text: "Used to validate big Data Feeds" });
    console.log(req.params.filename);
    res.render('index', { text: "Used to validate big Data Feeds" });
})

function deleteAllFilesFromFeeds() {
    let directory = path.dirname(__dirname) + '/feeds/';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        if (files.length > 1) {
            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        }
    });
}

module.exports = router