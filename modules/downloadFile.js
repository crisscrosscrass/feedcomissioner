const downloadFile = function(fileUrl, cb) {
    var fs = require('fs'),
        path = require('path'),
        request = require('request'),
        url = require('url'),
        filename;

    var r = request(fileUrl)
        .on('response', function(res) {
            let contentDisp = res.headers['content-disposition'];
            if (contentDisp && /^attachment/i.test(contentDisp)) {
                try {
                    filename = contentDisp.toLowerCase()
                        .trim()
                        .split('filename=')[1]
                        .split(';')[0]
                        .replace(/"/g, '');
                } catch (error) {
                    filename = contentDisp.toLowerCase() + fileUrl.replace(/.*\./, ".");
                }
            } else {
                filename = path.basename(url.parse(fileUrl).path);
                if (!/\./.test(filename)) {
                    filename = 'unknown.' + filename;
                }
            }
            r.pipe(fs.createWriteStream(path.join(__dirname + '/../feeds/', filename)));
        })
        // .on('data', function(res) {

    //     console.log(res);
    //     // console.log(res.headers['content-length']);
    // })
    .on('end', function() {
        cb(filename);
    });
}

module.exports = downloadFile;