const fs = require('fs');
const convert = require('xml-js');

const convertXmlToJson = function(dest, fileName, cb) {
    var xml = require('fs').readFileSync(dest + fileName, 'utf8');
    jsonData = convert.xml2json(xml, { compact: true, spaces: 4 });
    newFileName = fileName.slice(0, -4) + '.json';
    fs.writeFile(dest + newFileName, jsonData, err => {
        if (err) return console.log(err);
        cb(newFileName);
    });
}

module.exports = convertXmlToJson;