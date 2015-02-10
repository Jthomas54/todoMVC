var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', { title: 'Expressjs Todo with Knockout!' });
});

module.exports = router;