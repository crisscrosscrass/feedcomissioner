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

const loadHeadersFromCSVold = function(file, cb) {
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
        cb(wantedLines);
        // topDelimiter = getTopDelimiter(wantedLines);
        // headers = wantedLines.toLocaleLowerCase().split(topDelimiter.sign);
        // process.exit(0);
    });



    // lineReader.eachLine(file, function(line) {
    //     topDelimiter = getTopDelimiter(line);
    //     //console.log("delimiter:", delimiterDetection[delimiter].sign);
    //     headers = line.toLocaleLowerCase().split(topDelimiter.sign);
    //     return false;
    // });



    // lineReader.open(file, function(err, reader) {
    //     if (err) throw err;
    //     if (reader.hasNextLine()) {
    //         reader.nextLine(function(err, line) {
    //             try {
    //                 if (err) throw err;
    //                 console.log(line);
    //             } finally {
    //                 reader.close(function(err) {
    //                     if (err) throw err;
    //                 });
    //             }
    //         });
    //     } else {
    //         reader.close(function(err) {
    //             if (err) throw err;
    //         });
    //     }
    // });

}

// headers = [
//     '"sku"', '"name"',
//     '"top category"', '"category"',
//     '"gender"', '"color"',
//     '"brand"', '"material"',
//     '"description"', '"price"',
//     '"old price"', '"currency"',
//     '"availability"', '"shipping costs"',
//     '"sizes"', '"image url"',
//     '"deeplink url"', '"date"',
//     '"ean"', '"aux imageurl 1"',
//     '"aux imageurl 2"', '"aux imageurl 3"',
//     '"aux imageurl 4"', '"base price"',
//     '"cpc desktop"', '"cpc mobile"',
//     '"auxiliary"', '"sales rank"',
//     '"item state"', '"category_2"',
//     '"energy label"', '"pattern"',
//     '"coupon"', '"look"',
//     '"heel height"', '"shipping time"',
//     '"in stock"', '"region"',
//     '"taste"', '"year"',
//     '"awards"', '"video url"',
//     '"fitting"', '"installment payments"',
//     '"varietal"', '"bottle size"',
//     '"minimum price"', '"old minimum price"',
//     '"country"'
// ];

// topDelimiter = ",";
// foundHeader = false;

module.exports = loadHeadersFromCSV;