var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let selectedFeatures = req.app.get('selected_features');
    if(!selectedFeatures || selectedFeatures.length === 0) {
        res.redirect('/');
        return false;
    }
    let featuresAsString = getFeaturesAsString(selectedFeatures);


    res.render('classifiers', {features: featuresAsString, train_part: req.app.get('train_part')});
});


router.post('/', function (req, res, next) {

    console.log(req.body.form_type, req.body.classifier, req.body.k, req.body.train_part);

    let selectedFeatures = req.get.set('selected_features');
    let featuresAsString = getFeaturesAsString(selectedFeatures);

    if(req.body.form_type === 'train') {
        classifierTrain(req, res, next, featuresAsString);

    }
    else if(req.body.form_type === 'execute') {
        classifierExecute(req, res, next, featuresAsString);
    }

});

function classifierTrain (req, res, next, featuresAsString) {
    console.log('tttrain');

    res.render('classifiers', {features: featuresAsString, train_part: req.app.get('train_part')});
}

function classifierExecute (req, res, next, featuresAsString) {
    console.log('eececute');
    res.render('classifiers', {features: featuresAsString, train_part: req.app.get('train_part')});
}

function getFeaturesAsString(selectedFeatures) {
    let featuresAsString = '';
    selectedFeatures.forEach(function (feature) {
        featuresAsString += 'c'+feature + ', ';
    });
    return featuresAsString;
}

module.exports = router;
