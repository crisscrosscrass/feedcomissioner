const fetch = require("node-fetch");
const fs = require('fs');
const path = require('path');

const loadSyncConfig = require('../modules/loadSyncConfig');
const loadHeadersFromCSV = require('../modules/loadHeadersFromCSV');
var FeedValidation = require('../modules/FeedValidation');


dest = "" + path.dirname(__dirname) + '\\ressources\\data\\';
fileName = "SyncMapping_QM.xml";

loadSyncConfig(dest + fileName, function(syncMapping) {
    console.log(syncMapping);
    dest = "" + path.dirname(__dirname) + '\\feeds\\';
    fileName = "ladenzeile.csv";
    loadHeadersFromCSV(dest + fileName, function(headerValues) {
        console.log('headerValues before getElements:');
        console.log(headerValues, headerValues.length);
        validate = new FeedValidation(fileName);
    });
});