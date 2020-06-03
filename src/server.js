const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sampleRouter = require('./routes/sample')
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
app.use('/', feedcommissionerRouter)
app.listen(5000);