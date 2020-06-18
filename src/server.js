const express = require('express')
const socket = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sampleRouter = require('./routes/sample')
const filesRouter = require('./routes/listingfiles')
const splitterRouter = require('./routes/filesplitter')
const feedcommissionerRouter = require('./routes/feedcommissioner')
const app = express()

// Settings
app.set('view engine', 'ejs')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use((err, req, res, next) => {
    if (!err) return next();
    return res.status(400).json({
        status: 400,
        error: 'OOps! Bad request',
    });
});
app.post(function(req, res, next) {
    next();
});
// Routing
app.use(express.static(__dirname + '/ressources'));
app.use('/feeds', express.static(__dirname + '/feeds'));
app.use('/sample', sampleRouter)
app.use('/files', filesRouter)
app.use('/splitter', splitterRouter)
app.use('/', feedcommissionerRouter)
var server = app.listen(8060, '0.0.0.0', function() {
    console.log("listening to request on port 8060");
});
// Socket Setup
var io = socket(server);
app.set('socketio', io);