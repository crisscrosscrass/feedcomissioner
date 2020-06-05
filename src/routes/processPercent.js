const express = require('express');
const router = express.Router();
const sys = require('util');

router.get('/', (req, res) => {
    res.header('Content-Type', 'text/event-stream');
    res.render('process', { text: "Used to validate sample Feeds with percent!" });
})

router.get('/start', (req, res) => {
    res.set('Content-Type', 'text/event-stream');
    let counter = 0
    var interval_id = setInterval(function() {
        res.write("Counter: " + counter + "\n");
        counter++;
    }, 50);

    req.socket.on('close', function() {
        clearInterval(interval_id);
    });
})

module.exports = router