function getTopDelimiter(line) {
    return new Promise((resolve, reject) => {
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
        if (topDelimiter == null) {
            reject("Something went wrong");
        }
        resolve(topDelimiter);
    })
}

module.exports = getTopDelimiter;