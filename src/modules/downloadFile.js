const downloadFile = function(fileUrl, io, cb) {
    var fs = require('fs'),
        path = require('path'),
        request = require('request'),
        url = require('url'),
        Client = require('ftp'),
        c = new Client(),
        filename;

    var received_bytes = 0;
    var total_bytes = 0;
    try {
        if (/http/.test(fileUrl)) {
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
        } else {
            //example ftp://ShopAlikeFR151:ShopAlikeFR_151@aftp.linksynergy.com/44096/44096_3612151_167763915_cmp.xml.gz'
            ftpURL = fileUrl.replace(/.*\/\//, "")
            dest = "" + path.dirname(__dirname) + '/../feeds/';

            user = ftpURL.replace(/\:.*/, "");
            password = ftpURL.replace(/.*\:/, "").replace(/\@.*/, "");
            host = ftpURL.replace(/.*\@/, "").replace(/\/.*/, "");
            location = ftpURL.replace(/.+?(?=\/)/, "");
            fileName = location.replace(/.*\//, "");
            console.log(user, password, host, location, fileName);

            var connectionProperties = {
                host: host,
                user: user,
                password: password
            };


            c.on('ready', function() {
                c.get(location, function(err, stream) {
                    if (err) throw err;
                    stream.once('close', function() {
                        c.end();
                        console.log("Downloading done", fileName)
                        cb(fileName);
                    });
                    stream
                        .on('data', function(res) {
                            //console.log(res);
                            received_bytes += res.length;

                            showProgress(received_bytes, total_bytes);
                            // console.log(res.headers['content-length']);
                        })
                        .pipe(fs.createWriteStream(path.join(__dirname + '/../feeds/', fileName)));
                });
            });
            c.connect(connectionProperties);
        }

    } catch (error) {
        console.log(error);
        try {

        } catch (error) {

        }
    }


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