const fs = require('fs');


async function convertBigXMLToCSV(dest, fileName, header, node) {
    return new Promise((resolve, rejected) => {
        var newFileName = fileName.slice(0, -4) + '.csv';
        var writer = fs.createWriteStream(dest + newFileName);
        writer.write(header.join("\|") + "\n");
        var XmlStream = require('xml-stream');
        var stream = fs.createReadStream(dest + fileName);
        stream.setEncoding('utf8');
        var xml = new XmlStream(stream);
        // xml.preserve('id', true);
        // xml.collect('subitem');
        var counter = 0;
        xml.on('endElement: ' + node, function(item) {
            var line = [];
            header.forEach(function(field) {
                line.push(item[field]);
            });
            writer.write(line.join("\|") + "\n");
            if (counter > 50000) {
                resolve(newFileName);
                xml.close();
                // stream.close();
            }
            counter++;
        });
        xml.on('end', function() {
            // console.log("END OF XML STREAMING")
            writer.write('END');
        });
        xml.on('error', function(err) {
            rejected(err);
        });
    })

}

module.exports = convertBigXMLToCSV;