async function createFileSplit(dest, fileName, startAt, maxLimit) {
    var maxLimit = maxLimit;
    var fs = require('fs');
    var startingAt = startAt,
        inputFile = fileName,
        outputFile = 'split-' + fileName;
    var encoding = require('encoding-japanese');
    var fileBuffer = fs.readFileSync(dest + inputFile);
    console.log(encoding.detect(fileBuffer))

    return new Promise((res, rej) => {
        var detectedEnconding = encoding.detect(fileBuffer);
        if (detectedEnconding == "UTF32") {
            detectedEnconding = "UTF8"
        }
        fs.writeFile(dest + outputFile, '', function(err) {
            if (err) return console.log(err);
            console.log("done");
            res(outputFile);
        });
        //append buffer/chunk to new file
        var logger = fs.createWriteStream(dest + outputFile, {
            flags: 'a',
            encoding: detectedEnconding
        })
        var myReadStream = fs.createReadStream(dest + inputFile, detectedEnconding);
        //erase file content

        myReadStream.on('data', function(chunk) {
            if (startingAt < maxLimit) {
                logger.write(chunk);
                startingAt++;
            }
        })
        myReadStream.on('error', function(error) {
            rej("error")
        })
    })

}

module.exports = createFileSplit;