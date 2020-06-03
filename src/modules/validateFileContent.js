function roundDigits(calc100) {
    return +(Math.round(calc100 + "e+2") + "e-2");
}

async function validateFileConent(file, delimiter, validatedElements) {
    return new Promise((resolve, reject) => {
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(file),
        });
        var lineCounter = 0;
        let countingEmptyValues = {};
        for (var prop in validatedElements) {
            if (validatedElements[prop].found) {
                validatedElements[prop].emptyCells = 0;
            }
            if (validatedElements[prop].found &&
                (prop == 'SKU' ||
                    prop == 'IMAGE URL' ||
                    prop == 'DEEPLINK URL')
            ) {
                validatedElements[prop].arrayOfValues = [];
            }
        }
        validatedElements.FEEDTABLE.sampleItems = [];

        lineReader.on('line', function(line) {
            if (!lineCounter < 1) {
                // console.log(line);
                content = line.toLocaleLowerCase().split(delimiter.sign);
                content.forEach(function(value, index) {
                    for (var prop in validatedElements) {
                        if (index == validatedElements[prop].columnIndex) {
                            //console.log(validatedElements[prop].name, validatedElements[prop].columnName, value);
                            if (value != null) {
                                if (value.length < 1) {
                                    validatedElements[prop].emptyCells += 1;
                                }
                            } else {
                                validatedElements[prop].emptyCells += 1;
                            }
                        }
                        if (validatedElements[prop].found && index == validatedElements[prop].columnIndex &&
                            (prop == 'SKU' || prop == 'IMAGE URL' || prop == 'DEEPLINK URL')) {
                            validatedElements[prop].arrayOfValues.push(value.trim());
                        }
                    }
                    // console.log('%d: %s', index, value);

                });
                if (lineCounter < 1001) {
                    validatedElements.FEEDTABLE.sampleItems.push(content);
                }

            }
            //console.log(lineCounter);
            lineCounter++;
        });
        lineReader.on('close', function() {
            for (var prop in validatedElements) {
                if (validatedElements[prop].found) {
                    validatedElements[prop].totalCells = lineCounter - 1;
                    validatedElements[prop].filledCells = lineCounter - 1 - validatedElements[prop].emptyCells;
                    let calc100 = Math.abs(100 - ((validatedElements[prop].emptyCells / (lineCounter - 1)) * 100));
                    validatedElements[prop].percentFilledCells = roundDigits(calc100);
                }
            }
            for (var prop in validatedElements) {
                if (validatedElements[prop].found &&
                    (prop == 'SKU' ||
                        prop == 'IMAGE URL' ||
                        prop == 'DEEPLINK URL')
                ) {
                    const uniqueSet = new Set(validatedElements[prop].arrayOfValues);
                    const backToArray = [...uniqueSet];
                    let sorted_arr = validatedElements[prop].arrayOfValues.slice().sort();
                    let results = [];
                    for (let l = 0; l < sorted_arr.length - 1; l++) {
                        if (sorted_arr[l + 1] == sorted_arr[l]) {
                            results.push(sorted_arr[l]);
                        }
                    }
                    console.log("Duplicate Check:", prop);
                    console.log(results);
                    console.log(results.length);
                    validatedElements[prop].amountOfDuplicates = results.length;
                    validatedElements[prop].percentOfDuplicates = Math.floor((results.length / (lineCounter - 1)) * 100) + ' %';;
                    validatedElements[prop].duplicatesUnique = backToArray;
                }
            }
            // validatedElements[prop].emptyCells = countingEmptyCells;
            // validatedElements[prop].totalCells = this.tableLines - 1;
            // validatedElements[prop].filledCells = this.tableLines - 1 - countingEmptyCells;
            // var calc100 = Math.abs(100 - ((countingEmptyCells / (this.tableLines - 1)) * 100));
            // validatedElements[prop].percentFilledCells = this.roundToTwo(calc100);
            validatedElements.FEEDTABLE.products = lineCounter - 1;
            console.log('Products: ', validatedElements.FEEDTABLE.products);
            console.log('Sample Items: ', validatedElements.FEEDTABLE.sampleItems.length);
            resolve(validatedElements);
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

module.exports = validateFileConent;