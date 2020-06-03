const checkfolder = function(folderPath, cb) {
    const fs = require('fs');
    const path = require('path');

    var dir = './feeds';




    fs.access(folderPath, function(err) {
        if (err && err.code === 'ENOENT') {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                cb(true);
            } else {
                cb(false);
            }
        } else {
            cb(true);
        }
    });

}

module.exports = checkfolder;