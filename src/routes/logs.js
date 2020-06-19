const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('logFile', { text: "Used to check recent logs" });
})

module.exports = router