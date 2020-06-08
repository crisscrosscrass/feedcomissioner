const fs = require('fs');


async function getXMLHeadersFromFile(fileName) {
    return new Promise((resolve, rejected) => {
        var counter = 0;
        var fields = new Set();
        var header = [];
        var XmlStream = require('xml-stream');
        var stream = fs.createReadStream(fileName);
        stream.setEncoding('utf8');
        var xml = new XmlStream(stream);
        // xml.preserve('id', true);
        xml.collect('subitem');
        xml.on('endElement: entry', function(item) {
            Object.keys(item).forEach((key) => fields.add(key))
            if (counter > 100) {
                stream.close();
                header = Array.from(fields);
                resolve(header)
            }
            counter++;
        });
        xml.on('error', (err) => {
            console.log(err);
        })
    })

}

module.exports = getXMLHeadersFromFile;