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

    let result = null;
    let selectedFeatures = [];
    switch (type) {
        case 'fisher':
            if(featuresNumber === 1) {
                result = fisher.calculateFisher1D(data.classes, data.noFeatures);
                selectedFeatures.push(result.bestFisherIndex);
                output += '<br>' + result['message'];
            }
            else {
                result = fisher.calculateFisherND(data.classes, featuresNumber, data.noFeatures);
                result.features.forEach(function (feature) {
                    selectedFeatures.push(feature);
                });
                output += '<br>' + result['message'];
            }
            break;
        case 'sfs':
            result = fisher.calculateSFS(data.classes, featuresNumber, data.noFeatures);
            result.features.forEach(function (feature) {
                selectedFeatures.push(feature);
            });
            output += '<br>' + result['message'];
            break;
    }

    req.app.set('selected_features', selectedFeatures);

    res.render('featuresselection', { output: output });
});

module.exports = router;
