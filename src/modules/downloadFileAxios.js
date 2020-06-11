var axios = require('axios')
var fs = require('fs')
const path = require('path');

axios({
        method: 'get',
        url: 'https://docs.google.com/spreadsheets/d/16xXH9qj5dHhxAruxGFrnvANplpPhQC8CSS0R0NsNgGc/export?format=csv',
        responseType: 'stream'
    })
    .then(function(response) {
        console.log(response);
        let headerLine = response.data.headers['content-disposition']
        console.log(headerLine);
        let startFileNameIndex = headerLine.indexOf('"') + 1
        let endFileNameIndex = headerLine.lastIndexOf('"')
        let filename = headerLine.substring(startFileNameIndex, endFileNameIndex)
        response.data.pipe(fs.createWriteStream(filename))
    }).catch(function(error) {
        console.log(console.log(error))
    });