var axios = require('axios')
var fs = require('fs')
const path = require('path')

axios({
        method: 'get',
        url: 'ftp://ftp-10157-147765031:45dc3f77@ftp.semtrack.de/147765031.10157.csv',
        responseType: 'stream',
        timeout: 1
    })
    .then(function(response) {
        const totalLength = response.data.headers['content-length']
        let headerLine = response.data.headers['content-disposition']
        let startFileNameIndex = headerLine.indexOf('"') + 1
        let endFileNameIndex = headerLine.lastIndexOf('"')
        let filename = headerLine.substring(startFileNameIndex, endFileNameIndex)
        const dest = "" + path.dirname(__dirname) + '\\feeds\\';
        response.data.on('data', (chunk) => {
            console.log(chunk.length, totalLength)
        })
        response.data.pipe(fs.createWriteStream(dest + filename))
    })
    .catch(function(error) {
        if (error.code == 'ETIMEDOUT') {
            console.log("TIMED OUT!");
        } else {
            console.log(error);
        }
    });