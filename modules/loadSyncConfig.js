const fetch = require("node-fetch");
const fs = require('fs');
const xml2js = require('xml2js');
const node_xml_stream = require('node-xml-stream');
const parser = new node_xml_stream();

class SyncMappingConfig {
    constructor() {
        this.syncMappingCollection = [];
    }
    addAttribute(processing, name, regex) {
        //let regex = "";
        //regexString.length > 1 ? regex = '/' + regexString + '/' : "";
        let SyncMapping = { processing: processing, name: name, regex: regex }
        this.syncMappingCollection.push(SyncMapping);
    }
    displayCollection() {
        console.log(this.syncMappingCollection);
    }
    sortCollection() {
        let newArray = [...this.syncMappingCollection];
        newArray.sort((a, b) => parseInt(a.processing) - parseInt(b.processing));
        console.log(this.syncMappingCollection);
        console.log(newArray);
    }
}

async function loadSyncConfig(file) {
    // return new Promise((resolve, reject) => {
    //     syncMapping = new SyncMappingConfig();
    //     parser.on('opentag', function(name, attrs) {
    //         if (name == "column-mapping") {
    //             console.log("name : ", name)
    //             console.log("attrs : ", attrs)
    //             syncMapping.addAttribute(attrs.processed, attrs.name, attrs.originalname);
    //         }
    //     });
    //     parser.on('finish', function(name, attrs) {
    //         console.log("DONE");
    //         stream.close();
    //         resolve(syncMapping);
    //     });
    //     let stream = fs.createReadStream(file, 'UTF-8');
    //     stream.pipe(parser);
    // })

    return new Promise((resolve, reject) => {
        var parseString = require('xml2js').parseString;
        fs.readFile(file, function(err, data) {
            var data = data.toString().replace("\ufeff", "");
            parseString(data, function(err, result) {
                resolve(result)
            });
        });
        // const parser = new xml2js.Parser({ explicitArray: false });

        // parser.parseString(file, (error, result) => {
        //     if (error) reject(error);
        //     else resolve(result);
        // });
    });
}

module.exports = loadSyncConfig;