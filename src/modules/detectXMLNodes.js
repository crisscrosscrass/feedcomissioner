const fs = require('fs');
const sax = require('sax');


async function detectXMLNodes(dest, fileName) {
    return new Promise((resolve, rejected) => {
        var saxStream = sax.createStream();
        var nodeSets = new Set();

        saxStream.onopentag = function(node) {
            if (node.name === 'PRODUCT') {
                console.log(node.attributes.PRODUCT_ID);
            }
        };
        saxStream.onopentag = function(node) {
            // opened a tag.  node has "name" and "attributes"
            nodeSets.add(node.name);
            if (node.name === 'ENTRY') {
                resolve('entry');
                saxStream.end();
            }
            if (node.name === 'SHOPITEM') {
                resolve('shopitem');
                saxStream.end();
            }
            if (node.name === 'PRODUCT') {
                resolve('product');
                saxStream.end();
            }
            if (node.name === 'ITEM') {
                resolve('item');
                saxStream.end();
            }
        };
        saxStream.on("close", function(node) {
            // same object as above
            resolve("unknown");
        })
        saxStream.on("error", function(node) {
            // same object as above
            rejected(node)
        })

        fs.createReadStream(dest + fileName).pipe(saxStream);
    });

}

module.exports = detectXMLNodes;