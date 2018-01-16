var express = require('express');
var fisher = require("./../fisher");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // req.app.get('data')

    let data = req.app.get('data');
    let output = 'noClass: ' + data.classes.length  +
        '<br>noObjects: ' + data.noObjects +
        '<br>noFeatures: ' + data.noFeatures;

    res.render('featuresselection', {
        output: output
    });
});

router.post('/', function(req, res, next) {

    let type = req.body.type;
    let featuresNumber = parseInt(req.body.features_number);

    let data = req.app.get('data');
    let output = 'noClass: ' + data.classes.length  +
        '<br>noObjects: ' + data.noObjects +
        '<br>noFeatures: ' + data.noFeatures;

    switch (type) {
        case 'fisher':
            if(featuresNumber === 1) {
                output += '<br>' + fisher.calculateFisher1D(data.classes, data.noFeatures)['message'];
            }
            else {
                output += '<br>' + fisher.calculateFisherND(data.classes, featuresNumber, data.noFeatures)['message'];
            }
            break;
        case 'sfs':
            output += '<br>' + fisher.calculateSFS(data.classes, featuresNumber, data.noFeatures)['message'];
            break;
    }

    res.render('featuresselection', { output: output });
});

module.exports = router;
