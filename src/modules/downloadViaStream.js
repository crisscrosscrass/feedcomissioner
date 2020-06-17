const http = require('http');
const https = require('https');

Client = require('ftp'),
    c = new Client();
var fs = require('fs'),
    path = require('path'),
    request = require('request'),
    url = require('url'),
    filename;

async function downloadFileViaStream(fileUrl, filePath, limit) {
    var logger,
        batches = 0;

    return new Promise((resolve, reject) => {
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
                        fs.writeFile(filePath + "split-" + filename, '', function(err) {
                            if (err) return console.log(err);
                        });
                        logger = fs.createWriteStream(filePath + "split-" + filename, {
                            flags: 'a',
                            encoding: "utf8"
                        })
                        r.pipe(fs.createWriteStream(filePath + "split-" + filename));
                    })
                    .on('uncaughtException', function(err) {
                        console.error(err.stack);
                        console.log("Node NOT Exiting...");
                        reject(err.stack);
                    })
                    .on('data', function(res) {
                        if (limit < batches) {
                            logger.write(res);
                        }
                        if (batches > limit) {
                            r.pause();
                            resolve("split-" + filename);
                        }
                        ++batches;
                        // console.log(res.headers['content-length']);
                    })
                    .on('end', function() {
                        // res.set('content-type', 'application/json');
                        resolve("split-" + filename);
                    });
            } else {

                ftpURL = fileUrl.replace(/.*\/\//, "")
                dest = "" + path.dirname(__dirname) + '/../feeds/';

                user = ftpURL.replace(/\:.*/, "");
                password = ftpURL.replace(/.*\:/, "").replace(/\@.*/, "");
                host = ftpURL.replace(/.*\@/, "").replace(/\/.*/, "");
                location = ftpURL.replace(/.+?(?=\/)/, "");
                fileName = location.replace(/.*\//, "");
                console.log(user, password, host, location, fileName);

                //create empty file
                fs.writeFile(filePath + "split-" + fileName, '', function(err) {
                    if (err) return console.log(err);
                });

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
                            resolve("split-" + fileName);
                        });
                        stream
                            .on('data', function(res) {
                                if (limit < batches) {
                                    console.log("Write to stream", res);
                                    logger.write(res);
                                }
                                if (batches > limit) {
                                    stream.pause();
                                    c.end();
                                    resolve("split-" + fileName);
                                }
                                ++batches;
                            })

                        logger = fs.createWriteStream(filePath + "split-" + fileName, {
                            flags: 'a',
                            encoding: "utf8"
                        })
                    });
                });
                c.connect(connectionProperties);
            }

        } catch (error) {
            console.log("ERROR")
            console.log(error)
        }
    })
}

module.exports = downloadFileViaStream