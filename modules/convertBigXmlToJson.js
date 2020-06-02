const fs = require('fs');

var sax = require("../node_modules/sax/lib/sax"),
    strict = true, // set to false for html-mode
    parser = sax.parser(strict);

const convertBigXmlToJson = function(dest, fileName, cb) {
    fs.writeFileSync(dest + fileName + "-copy.json", "");
    var data_array = [];
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
        console.log(node);
        console.log(node.name);
    })
    saxStream.on("opentag", function(node) {
        // same object as above
        fs.appendFileSync(dest + fileName + "-copy.txt", JSON.stringify(node, null, 4), function(err) {
            if (err) throw err;
            console.log('Saved!');
        });
    })
    saxStream.on("close", function(node) {
        // same object as above
        cb("fileNameXYZ")
    })
    fs.createReadStream(file)
        .pipe(saxStream)
        //.pipe(fs.createWriteStream(dest + fileName + "-copy.json"))
}

module.exports = convertBigXmlToJson;