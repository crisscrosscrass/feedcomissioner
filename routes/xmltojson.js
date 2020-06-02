const fs = require('fs');
const path = require('path');
const convert = require('xml-js');
const convertXmlToJson = require('../modules/convertXmlToJson');
const convertBigXmlToJson = require('../modules/convertBigXmlToJson');

fileName = "ladenzeile_2020-05-28_09-03-35.xml"
fileName = "ladenzeile.xml"
fileName = "RS_COMPONENTS_ES_IT-RS_Components_IT_Product_Feed-shopping.xml"
dest = "" + path.dirname(__dirname) + '\\feeds\\';
try {
    convertXmlToJson(dest, fileName, function(fileName) {
        console.log('done XML > JSON, new file: ', fileName);
    });
} catch (error) {
    if (error.code == "ERR_STRING_TOO_LONG") {
        console.log("Feed too big");
        convertBigXmlToJson(dest, fileName, function(fileName) {
            console.log('done XML > JSON, new file: ', fileName);
        });
    } else {
        console.log(error.code);
    }
}