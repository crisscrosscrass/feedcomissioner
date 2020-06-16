var path = require('path');
var fs = require('fs');
var Client = require('ftp');
var c = new Client();

input = 'ftp://ShopAlikeFR151:ShopAlikeFR_151@aftp.linksynergy.com/44096/44096_3612151_167763915_cmp.xml.gz'
url = input.replace(/.*\/\//, "")
dest = "" + path.dirname(__dirname) + '\\feeds\\';

user = url.replace(/\:.*/, "");
password = url.replace(/.*\:/, "").replace(/\@.*/, "");
host = url.replace(/.*\@/, "").replace(/\/.*/, "");
location = url.replace(/.+?(?=\/)/, "");
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
        });
        stream.pipe(fs.createWriteStream(dest + fileName));
    });
});


c.connect(connectionProperties);