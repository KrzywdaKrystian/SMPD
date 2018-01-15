var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('classifiers', { title: 'Express Classifiers' });
});

module.exports = router;
