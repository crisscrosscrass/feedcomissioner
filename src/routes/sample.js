const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { text: "Used to validate huge SAMPLES FEEDS haha!" });
})

module.exports = router