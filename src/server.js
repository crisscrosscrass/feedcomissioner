require('dotenv').config();

const express = require('express');
const socket = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require("./modules/logger");
const sampleRouter = require('./routes/sample')
const filesRouter = require('./routes/listingfiles')
const splitterRouter = require('./routes/filesplitter')
const logsRouter = require('./routes/logs')
const feedcommissionerRouter = require('./routes/feedcommissioner')
const app = express()



// console.log(process.env.SECRET_MESSAGE);

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
app.use('/logs', logsRouter)
app.use('/', feedcommissionerRouter)

const port = process.env.PORT || 8060;
const host = '0.0.0.0';

var server = app.listen(port, host, function() {
    //console.log(`Running on http//${host}:${port}`);
    logger.info(`Starting Server, listening to request on port ${port}`);
});
// Socket Setup
var io = socket(server);
app.set('socketio', io);