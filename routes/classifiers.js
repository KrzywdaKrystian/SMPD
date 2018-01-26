var express = require('express');
var classifiers = require("./../classifiers");

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    let featuresAsString = getFeaturesAsString(req);
    if(!featuresAsString) {
        res.redirect('/');
        return false;
    }

    let data = req.app.get('data');
    let output = 'noClass: ' + data.classes.length  +
        '<br>noObjects: ' + data.noObjects +
        '<br>noFeatures: ' + data.noFeatures;


    res.render('classifiers', {
        features: featuresAsString,
        train_part: req.app.get('train_part'),
        output: output
    });
});


router.post('/', function (req, res, next) {

    console.log(req.body.form_type, req.body.classifier, req.body.k, req.body.train_part);

    let featuresAsString = getFeaturesAsString(req);
    if(!featuresAsString) {
        res.redirect('/');
        return false;
    }

    let data = req.app.get('data');
    let output = 'noClass: ' + data.classes.length  +
        '<br>noObjects: ' + data.noObjects +
        '<br>noFeatures: ' + data.noFeatures;


    if(req.body.form_type === 'execute') {
        let trainingSet = req.app.get('training_set');
        let testSet = req.app.get('test_set');

        switch (req.body.classifier) {
            case "nn":
                output += '<br>' + '[NN] ' + classifiers.calculate_NN(trainingSet, testSet)['message'];
                break;
            case "knn":
                output += '<br>' + '[kNN, k = ' + req.body.k + '] ' + classifiers.calculate_k_NN(req.body.k, trainingSet, testSet)['message'];
                break;
            case "nm":
                output += '<br>' + '[NM] ' + classifiers.calculate_NM(trainingSet, testSet)['message'];
                break;
            case "knm":
                output += '<br>' + '[kNM, k = ' + req.body.k + '] ' + classifiers.calculate_k_NM(trainingSet, testSet)['message'];
                break;
        }
    }
    else {

        let sets = null;
        switch (req.body.form_type ){
            case "train":
                sets = generateTrainAndTestSet(data.classes,
                    req.app.get('selected_features'),
                    req.body.train_part);
                output += '<br>[Train] Test and training set was generated!';
                break;
            case "bootstrap":
                sets = generateTrainAndTestSetBootstrap(data.classes,
                    req.app.get('selected_features'),
                    req.body.train_part);
                output += '<br>[Bootstrap] Test and training set was generated!';
                break;
            case "crossvalidation":
                sets = generateTrainAndTestSetCrossValidation(data.classes,
                    req.app.get('selected_features'),
                    req.body.train_part);
                output += '<br>[Bootstrap] Test and training set was generated!';
                break;
        }

        req.app.set('train_part', req.body.train_part);
        req.app.set('training_set', sets.trainSet);
        req.app.set('test_set', sets.testSet);
    }

    res.render('classifiers', {
        features: featuresAsString,
        train_part: req.app.get('train_part'),
        output: output,
        executeEnabled: req.app.get('training_set') && req.app.get('training_set').length > 0 && req.app.get('test_set') && req.app.get('test_set').length > 0
    });

});

function getFeaturesAsString(req) {

    let selectedFeatures = req.app.get('selected_features');
    if(!selectedFeatures || selectedFeatures.length === 0) {
        return false;
    }

    let featuresAsString = '';
    selectedFeatures.forEach(function (feature) {
        featuresAsString += 'c'+feature + ', ';
    });

    return featuresAsString;
}

function generateTrainAndTestSet(classes, selectedFeatures, trainPart) {

    let trainSet = [];
    let testSet = [];

    classes.forEach(function (classObj, classIndex) {
        // get random indexes to trainSet
        let trainSetIndexes = getRandomIndexes(classObj[0].length * trainPart/100, classObj[0].length);
        // console.log('trainSetIndexes', trainSetIndexes);
        // build trainSet and testSet from selected features
        trainSet[classIndex] = [];

        // each class
        classObj.forEach(function (feature, featureIndex) {

            // only selected features
            if(selectedFeatures.indexOf(featureIndex) > -1) {
                // console.log('featureIndex', featureIndex);
                // each selected features
                // console.log('trainSetIndexes', trainSetIndexes[classIndex]);
                feature.forEach(function (sample, sampleIndex) {

                    // only selected samples
                    if(trainSetIndexes.indexOf(sampleIndex) > -1) {
                        // classIndex, featureIndex
                        // console.log('sampleIndex', sampleIndex, trainSetIndexes, sampleIndex);
                        trainSet[classIndex].push(sample);
                    }
                    else {
                        testSet.push({
                            value: sample,
                            orginal_class_index: classIndex
                        })
                    }
                })
            }
        })

    });

    return {
        trainSet : trainSet,
        testSet : testSet
    }
}

function generateTrainAndTestSetBootstrap(classes, selectedFeatures, trainPart) {

    let trainSet = [];
    let testSet = [];


    return {
        trainSet : trainSet,
        testSet : testSet
    }
}

function generateTrainAndTestSetCrossValidation(classes, selectedFeatures, trainPart) {

    let trainSet = [];
    let testSet = [];


    return {
        trainSet : trainSet,
        testSet : testSet
    }
}

function getRandomIndexes(n, max) {
    let arr = [];
    while(arr.length < n){
        let randomnumber = Math.floor(Math.random()*max) + 1;
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    return arr;
}

module.exports = router;
