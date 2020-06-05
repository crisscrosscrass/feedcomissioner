const express = require('express')
const socket = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sampleRouter = require('./routes/sample')
const processRouter = require('./routes/processPercent')
const feedcommissionerRouter = require('./routes/feedcommissioner')
const app = express()

// Settings
app.set('view engine', 'ejs')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.post(function(req, res, next) {
    next();
});
// Routing
app.use(express.static(__dirname + '/ressources'));
app.use('/feeds', express.static(__dirname + '/feeds'));
app.use('/sample', sampleRouter)
app.use('/process', processRouter)
app.use('/', feedcommissionerRouter)
var server = app.listen(8060, '0.0.0.0', function() {
    console.log("listening to request on port 8060");
});
// Socket Setup
var io = socket(server);
app.set('socketio', io);