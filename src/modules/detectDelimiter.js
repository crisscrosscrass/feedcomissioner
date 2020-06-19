function getTopDelimiter(line) {
    return new Promise((resolve, reject) => {
        separatorDetection = {}
            //delimiter
        separatorDetection.comma = {
            name: "comma",
            sign: ",",
            amount: line.split(",").length - 1
        }
        separatorDetection.pipe = {
            name: "pipe",
            sign: "|",
            amount: line.split("|").length - 1
        }
        separatorDetection.tab = {
            name: "tab",
            sign: "\t",
            amount: line.split("\t").length - 1
        }
        separatorDetection.semicolon = {
            name: "semicolon",
            sign: ";",
            amount: line.split(";").length - 1
        }
        keysSorted = Object.keys(separatorDetection).sort(function(a, b) { return separatorDetection[a].amount - separatorDetection[b].amount })
        delimiter = keysSorted[keysSorted.length - 1]
        topDelimiter = separatorDetection[delimiter];
        if (topDelimiter == null) {
            reject("Something went wrong");
        }
        resolve(topDelimiter);
    })
}

module.exports = getTopDelimiter;