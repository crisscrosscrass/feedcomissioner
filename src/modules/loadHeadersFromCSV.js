const lineReader = require('line-reader');

function getTopDelimiter(line) {
    delimiterDetection = {}
        //delimiter
    delimiterDetection.comma = {
        name: "comma",
        sign: ",",
        amount: line.split(",").length - 1
    }
    delimiterDetection.pipe = {
        name: "pipe",
        sign: "|",
        amount: line.split("|").length - 1
    }
    delimiterDetection.tab = {
        name: "tab",
        sign: "\t",
        amount: line.split("\t").length - 1
    }
    delimiterDetection.semicolon = {
        name: "semicolon",
        sign: ";",
        amount: line.split(";").length - 1
    }
    keysSorted = Object.keys(delimiterDetection).sort(function(a, b) { return delimiterDetection[a].amount - delimiterDetection[b].amount })
    delimiter = keysSorted[keysSorted.length - 1]
    topDelimiter = delimiterDetection[delimiter];
    return topDelimiter;
}

async function loadHeadersFromCSV(file) {
    return new Promise((resolve, reject) => {
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(file),
        });
        var lineCounter = 0;
        let wantedLines;
        lineReader.on('line', function(line) {
            lineCounter++;
            wantedLines = line;
            if (lineCounter == 1) { lineReader.close(); }
        });
        lineReader.on('close', function() {
            resolve(wantedLines);
            // topDelimiter = getTopDelimiter(wantedLines);
            // headers = wantedLines.toLocaleLowerCase().split(topDelimiter.sign);
            // process.exit(0);
        });
        lineReader.on('error', function() {
            reject("Something went wrong");
            // topDelimiter = getTopDelimiter(wantedLines);
            // headers = wantedLines.toLocaleLowerCase().split(topDelimiter.sign);
            // process.exit(0);
        });
    })
}
module.exports = loadHeadersFromCSV;