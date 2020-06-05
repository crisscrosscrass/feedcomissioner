const downloadFile = function(fileUrl, io, cb) {
    var fs = require('fs'),
        path = require('path'),
        request = require('request'),
        url = require('url'),
        filename;

    var received_bytes = 0;
    var total_bytes = 0;

    var r = request(fileUrl)
        .on('response', function(res) {
            let contentDisp = res.headers['content-disposition'];
            total_bytes = parseInt(res.headers['content-length']);
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
        .on('uncaughtException', function(err) {
            console.error(err.stack);
            console.log("Node NOT Exiting...");
        })
        .on('data', function(res) {
            //console.log(res);
            received_bytes += res.length;

            showProgress(received_bytes, total_bytes);
            // console.log(res.headers['content-length']);
        })
        .on('end', function() {
            // res.set('content-type', 'application/json');
            cb(filename);
        });

    function showProgress(received, total) {
        var percentage = (received * 100) / total;
        var data;
        if (isNaN(parseInt(percentage))) {
            data = {
                message: "" + received + " bytes.",
                handle: "loaded"
            }
        } else {
            data = {
                message: percentage + "% <br/> " + received + " bytes out of " + total + " bytes.",
                handle: "loaded"
            }
        }
        io.sockets.emit('progress', data);
        // console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
    }
}

module.exports = downloadFile;