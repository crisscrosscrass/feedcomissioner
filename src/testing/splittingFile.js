const fs = require('fs');
const path = require('path');
const createFileSplit = require('../modules/fileSplit');


async function createSplitFromFile() {
    console.log("==========create split file============");
    fileName = "zbozi.xml";
    dest = "" + path.dirname(__dirname) + '\\feeds\\';
    var splitFile = await createFileSplit(dest, fileName, 0, 1);
    console.log(splitFile)
}

createSplitFromFile();