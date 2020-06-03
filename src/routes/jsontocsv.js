const fs = require('fs');
const path = require('path');
const convertJsonToCsv = require('../modules/convertJsonToCsv');
const converter = require('json-2-csv');
fileName = "google_com.json";
fileName = "ladenzeile.json";
//fileName = "rblcln_feed_de.json";
newFilename = fileName.slice(0, -5) + '.csv';

console.log("==========converting json to csv test============");
dest = "" + path.dirname(__dirname) + '\\feeds\\';

convertJsonToCsv(dest, fileName, function(fileName, rootNodes) {
    console.log('done JSON > CSV, new file: ', fileName, 'with nodes:', rootNodes);
});