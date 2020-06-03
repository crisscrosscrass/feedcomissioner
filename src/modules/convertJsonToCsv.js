const fs = require('fs');
const converter = require('json-2-csv');

const convertJsonToCsv = function(dest, fileName, cb) {
    let jsonFile = JSON.parse(fs.readFileSync(dest + fileName, 'utf8'));
    // create a map to identify the node with the most subnodes
    /*
    let copy = jsonFile;
    if (/\\n/.test(JSON.stringify(copy))) {
        jsonFile = JSON.parse(fs.readFileSync(dest + fileName, 'utf8').replace(/[\\n\\r]/g, ''));
    }
    */
    jsonMap = {};
    keyId = 0;
    subkeyId = 0;
    subsubkeyId = 0;
    Object.keys(jsonFile).forEach((key) => {
        jsonMap[keyId] = {
                location: key,
                sublevel: 1,
                key: key,
                amount: Object.entries(jsonFile[key]).length
            }
            ++keyId;
        Object.keys(jsonFile[key]).forEach((subkey) => {
            jsonMap[keyId + ' ' + subkeyId] = {
                    location: `[${key}][${subkey}]`,
                    sublevel: 2,
                    key: key,
                    subkey: subkey,
                    amount: Object.entries(jsonFile[key][subkey]).length
                }
                ++subkeyId;
            Object.keys(jsonFile[key][subkey]).forEach((subsubkey) => {
                jsonMap[keyId + ' ' + subkeyId + ' ' + subsubkeyId] = {
                        location: `['${key}']['${subkey}']['${subsubkey}']`,
                        sublevel: 3,
                        key: key,
                        subkey: subkey,
                        subsubkey: subsubkey,
                        amount: Object.entries(jsonFile[key][subkey][subsubkey]).length
                    }
                    ++subsubkeyId;
            });
        });
    });
    // sort the map to get the node with the most subnodes
    keysSorted = Object.keys(jsonMap).sort(function(a, b) { return jsonMap[a].amount - jsonMap[b].amount })
    getBiggestKey = keysSorted[keysSorted.length - 1]
    location = jsonMap[getBiggestKey].location;
    sublevel = jsonMap[getBiggestKey].sublevel;
    console.log(location);
    console.log(sublevel);
    console.log(jsonMap[getBiggestKey]);
    let items = ""
    if (sublevel == 1) {
        items = jsonFile[jsonMap[getBiggestKey].key];
    } else if (sublevel == 2) {
        items = jsonFile[jsonMap[getBiggestKey].key][jsonMap[getBiggestKey].subkey];
    } else if (sublevel == 3) {
        items = jsonFile[jsonMap[getBiggestKey].key][jsonMap[getBiggestKey].subkey][jsonMap[getBiggestKey].subsubkey];
    }

    // convert json data to csv file
    newFilename = fileName.slice(0, -5) + '.csv';
    var options = {
        delimiter: {
            wrap: '\'', // Double Quote (") character
            field: '|', // Comma field delimiter
            array: ',', // Semicolon array value delimiter
            eol: '\n' // Newline delimiter
        },
        prependHeader: true,
        sortHeader: false,
        trimHeaderValues: true,
        trimFieldValues: true,
    };

    converter.json2csv(items, (err, csv) => {
        if (err) {
            throw err;
        }
        fs.writeFileSync(dest + newFilename, csv);
        cb(newFilename, location);
    }, options);


}

module.exports = convertJsonToCsv;