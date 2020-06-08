const fs = require('fs');
const convert = require('xml-js');

const removeJsonTextAttribute = function(value, parentElement) {
    try {
        const parentOfParent = parentElement._parent;
        const pOpKeys = Object.keys(parentElement._parent);
        const keyNo = pOpKeys.length;
        const keyName = pOpKeys[keyNo - 1];
        const arrOfKey = parentElement._parent[keyName];
        const arrOfKeyLen = arrOfKey.length;
        if (arrOfKeyLen > 0) {
            const arr = arrOfKey;
            const arrIndex = arrOfKey.length - 1;
            arr[arrIndex] = value;
        } else {
            parentElement._parent[keyName] = value;
        }
    } catch (e) {}
};

const convertXmlToJson = function(dest, fileName, cb) {
    var xml = require('fs').readFileSync(dest + fileName, 'utf8');
    jsonData = convert.xml2json(xml, { compact: true, textFn: removeJsonTextAttribute, spaces: 4 });
    newFileName = fileName.slice(0, -4) + '.json';
    fs.writeFile(dest + newFileName, jsonData, err => {
        if (err) return console.log(err);
        cb(newFileName);
    });
}

module.exports = convertXmlToJson;