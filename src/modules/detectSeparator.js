function getTopSeparator(line) {
    return new Promise((resolve, reject) => {
        separatorDetection = {}
            //delimiter
        separatorDetection.comma = {
            name: "comma",
            sign: ",",
            amount: line.split(",").length - 1
        }
        separatorDetection.singlequoteandcomma = {
            name: "singlequoteandcomma",
            sign: "','",
            amount: line.split("','").length - 1
        }
        separatorDetection.doublequoteandcomma = {
            name: "doubleequoteandcomma",
            sign: '","',
            amount: line.split('","').length - 1
        }
        separatorDetection.pipe = {
            name: "pipe",
            sign: "|",
            amount: line.split("|").length - 1
        }
        separatorDetection.singlequoteandpipe = {
            name: "singlequoteandpipe",
            sign: "'|'",
            amount: line.split("'|'").length - 1
        }
        separatorDetection.doublequoteandpipe = {
            name: "doublequoteandpipe",
            sign: '"|"',
            amount: line.split('"|"').length - 1
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
        separatorDetection.singlequoteandsemicolon = {
            name: "singlequoteandsemicolon",
            sign: "';'",
            amount: line.split("';'").length - 1
        }
        separatorDetection.doublequoteandsemicolon = {
            name: "doublequoteandsemicolon",
            sign: '";"',
            amount: line.split('";"').length - 1
        }
        keysSorted = Object.keys(separatorDetection).sort(function(a, b) { return separatorDetection[a].amount - separatorDetection[b].amount })
        separator = keysSorted[keysSorted.length - 1]
        topSeparator = separatorDetection[separator];
        if (topSeparator == null) {
            reject("Something went wrong");
        }
        resolve(topSeparator);
    })
}

module.exports = getTopSeparator;