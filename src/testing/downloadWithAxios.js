var axios = require('axios')
var fs = require('fs')
const path = require('path');

dest = "" + path.dirname(__dirname) + '\\feeds\\';

axios({
        method: 'get',
        url: 'ftp://ShopAlikeFR151:ShopAlikeFR_151@aftp.linksynergy.com/44096/44096_3612151_167763915_cmp.xml.gz',
        headers: { 'User-Agent': 'Mozilla/5.0 (ShopAlike; LadenZeile) FeedBot' },
        responseType: 'stream'
    })
    .then(function(response) {
        // console.log(response);
        let headerLine = response.data.headers['content-disposition']
        console.log(headerLine);
        let startFileNameIndex = headerLine.indexOf('"') + 1
        let endFileNameIndex = headerLine.lastIndexOf('"')
        let filename = headerLine.substring(startFileNameIndex, endFileNameIndex)
        response.data.pipe(fs.createWriteStream(dest + filename))
    }).catch(function(error) {
        console.log(console.log(error))
    });