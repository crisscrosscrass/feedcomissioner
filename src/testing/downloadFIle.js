var fs = require('fs')
const path = require('path')
const downloadViaStream = require('../modules/downloadViaStream');
const createFileSplit = require('../modules/fileSplit');
dest = "" + path.dirname(__dirname) + '\\feeds\\';

async function downloadViaStreamExample() {
    console.log("==========downlaod via Stream split file============");
    var batch = 1;
    url = "ftp://ShopAlikeFR151:ShopAlikeFR_151@aftp.linksynergy.com/44096/44096_3612151_167763915_cmp.xml.gz";
    try {
        var downloadedFile = await downloadViaStream(url, dest, batch);
        console.log(downloadedFile)
    } catch (error) {
        console.log(error);
    }
}

downloadViaStreamExample()