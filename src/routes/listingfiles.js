const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
var formidable = require('formidable');
const multer = require('multer');
const feedsFolder = path.dirname(__dirname) + '/feeds/';
const checkfolder = require('../modules/foldercheck');

//set Storage Engine
const storage = multer.diskStorage({
    destination: feedsFolder,
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    }
}).single('filetoupload');

function checkFileType(file, cb) {
    const fileTypes = /csv|xml|zip|gz|txt|json/;
    const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

    if (extname) {
        return cb(null, true)
    } else {
        cb('Error: Filetype not allowed!');
    }
}

router.get('/', (req, res) => {
    checkfolder(path.dirname(__dirname) + '/feeds/', (exist) => {
        let percent = 0;
        let byteSize = 0;
        let feedList = [];
        if (exist) {
            fs.readdirSync(feedsFolder).forEach(file => {
                feedList.push({ file: file, size: getFilesizeInBytes(file) })
                    // console.log(file, getFilesizeInBytes(file));
                byteSize += fs.statSync(feedsFolder + file)["size"]
            });
            byteSize = byteSize / 1000000.0;
            console.log(byteSize);
            console.log(3000.00);
            percent = byteSize / 3000.00 * 100;
            res.render('listingfiles', { text: "All stored Files", feedList, percent }, );
        } else {
            res.render('listingfiles', { text: "All stored Files", feedList, percent }, );
        }
    });
});
router.post('/feeduploaded', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.write(err);
            return res.end();
        } else {
            if (req.file == undefined) {
                res.write("Error: No File Selected!");
                return res.end();
            } else {
                res.write('<h1>Upload complete</h1>');
                res.write(`Your file ${req.file.originalname} has been uploaded!<br/>`);
                res.write(`<script>
            let url = document.location.href.replace("/feeduploaded","");
            setTimeout(function(){ window.location.href=url; }, 1000);
            </script>`);
                return res.end();
            }
        }
    });
})
router.get('/uploadfeed', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="feeduploaded" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit" value="Upload">');
    res.write('</form>');
    return res.end();
})
router.get('/delete/:filename', (req, res) => {
    fs.readdirSync(feedsFolder).forEach(file => {
        if (file == req.params.filename) {
            console.log("delete", req.params.filename)
            fs.unlinkSync(feedsFolder + req.params.filename)
        }
    });
    console.log("your requested: ", req.params.filename);
    res.writeHead(302, {
        'Location': '/files'
    });
    res.end();
})
router.get('/:filename', (req, res) => {
    let feedList = [];
    fs.readdirSync(feedsFolder).forEach(file => {
        feedList.push({ file: file, size: getFilesizeInBytes(file) })
            // console.log(file, getFilesizeInBytes(file));
    });
    // console.log(feedList);
    console.log("your requested: ", req.params.filename);
    // res.render('listingFiles', { text: "All stored Files", feedList }, );
    // console.log(path.dirname(__dirname) + '/feeds/' + req.params.filename);
    // mimeType = "application/force-download"
    // res.setHeader('content-type', mimeType);
    // res.sendFile(path.dirname(__dirname) + '/feeds/' + req.params.filename, err => console.log(err));
    var file = req.params.filename;
    var fileLocation = path.dirname(__dirname) + '/feeds/' + file;
    res.download(fileLocation);
})


function getFilesizeInBytes(filename) {
    var stats = fs.statSync(feedsFolder + filename)
    var fileSizeInBytes = stats["size"]
    return fileSizeInBytes / 1000000.0 + " MB";
}

module.exports = router