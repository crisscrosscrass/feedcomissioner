const fs = require('fs');

var sax = require("../node_modules/sax/lib/sax"),
    strict = true, // set to false for html-mode
    parser = sax.parser(strict);

const convertBigXmlToJson = function(dest, fileName, cb) {
    file = dest + fileName
        //var saxStream = require("sax").createStream(strict, options)
    var saxStream = require("sax").createStream(strict)
    saxStream.on("error", function(e) {
        // unhandled errors will throw, since this is a proper node
        // event emitter.
        console.error("error!", e)
            // clear the error
        this._parser.error = null
        this._parser.resume()
    })
    saxStream.on("ontext", function(node) {
        console.log("ON TEXT", node);
    })
    saxStream.on("onattribute", function(node) {
        // same object as above
        console.log("ON ATTRIBUTE", node);
    })
    saxStream.onopentag = function(node) {
        // opened a tag.  node has "name" and "attributes"
        // console.log("ON OPEN TAG", node);
    };
    saxStream.onend = function(node) {
        // opened a tag.  node has "name" and "attributes"
        console.log(node);
    };
    saxStream.on("close", function(node) {
        // same object as above
        cb("fileNameXYZ")
    })
    fs.createReadStream(file)
        .pipe(saxStream)
        .pipe(fs.createWriteStream(dest + fileName + "-copy.xml"))
}

module.exports = convertBigXmlToJson;