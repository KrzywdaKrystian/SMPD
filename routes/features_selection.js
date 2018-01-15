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
    console.log('post');

    let type = req.body.type;
    let featuresNumber = parseInt(req.body.features_number);

    let data = req.app.get('data');
    let output = 'noClass: ' + data.classes.length  +
        '<br>noObjects: ' + data.noObjects +
        '<br>noFeatures: ' + data.noFeatures;


    console.log(type, featuresNumber);

    switch (type) {
        case 'fisher':
            console.log(featuresNumber);
            if(featuresNumber === 1) {
                output += '<br>' + fisher.calculate1D(data.classes, data.noFeatures);
            }
            else {
                output += '<br>' + fisher.calculateND(data.classes, featuresNumber, data.noFeatures);
            }

            break;
        case 'sfs':
            break;
    }

    res.render('featuresselection', { output: output });
});

module.exports = router;
