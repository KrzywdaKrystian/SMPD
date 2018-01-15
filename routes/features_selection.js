var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('get');
    res.render('featuresselection', { title: 'Express' });
});

router.post('/', function(req, res, next) {
    console.log('post');
    res.render('featuresselection', { title: 'Express' });
});

module.exports = router;
