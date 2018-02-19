var express = require('express');
var classifiers = require("./../classifiers");
var train = require("./../train");

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    let featuresAsString = getFeaturesAsString(req);
    if (!featuresAsString) {
        res.redirect('/');
        return false;
    }

    let data = req.app.get('data');
    let output = 'noClass: ' + data.classes.length +
        '<br>noObjects: ' + data.noObjects +
        '<br>noFeatures: ' + data.noFeatures;

    res.app.set('output', output + '<br>' + featuresAsString);

    res.render('classifiers', {
        features: featuresAsString,
        train_part: req.app.get('train_part'),
        generate_data: 'percentage',
        cross_part: 5,
        k: req.app.get('k') ? req.app.get('k') : 1,
        output: output
    });
});


router.post('/', function (req, res, next) {

    console.log(req.body.form_type, req.body.classifier, req.body.k, req.body.train_part, req.body.generate_data);

    let featuresAsString = getFeaturesAsString(req);
    if (!featuresAsString) {
        res.redirect('/');
        return false;
    }

    let data = req.app.get('data');
    let output = res.app.get('output');

    req.app.set('k', req.body.k);
    req.app.set('classifier', req.body.classifier);
    req.app.set('train_part', req.body.train_part);

    if (req.body.form_type === 'execute') {
        let trainingSet = req.app.get('training_set');
        let testSet = req.app.get('test_set');

        if (req.body.generate_data === 'crossvalidation') {
            let nnSum = 0;
            let knnSum = 0;
            let nmSum = 0;
            let knmSum = 0;

            let nn, knn, nm, knm;
            for (let i = 0; i < trainingSet.length; i++) {
                switch (req.body.classifier) {
                    case "nn":
                        nn = classifiers.calculate_NN(trainingSet[i], testSet[i]);
                        nnSum += nn.effectiveness;
                        break;
                    case "knn":
                        knn = classifiers.calculate_k_NN(7, trainingSet[i], testSet[i]);
                        knnSum += knn.effectiveness;
                        break;
                    case "nm":
                        nm = classifiers.calculate_NM(trainingSet[i], testSet[i]);
                        nmSum += nm.effectiveness;
                        break;
                    case "knm":
                        knm = classifiers.calculate_k_NM(7, trainingSet[i], testSet[i]);
                        knmSum += knm.effectiveness;
                        break;
                    default:

                        // console.log(i);

                        nn = classifiers.calculate_NN(trainingSet[i], testSet[i]);
                        nnSum += nn.effectiveness;
                        knn = classifiers.calculate_k_NN(req.body.k, trainingSet[i], testSet[i]);
                        knnSum += knn.effectiveness;
                        nm = classifiers.calculate_NM(trainingSet[i], testSet[i]);
                        nmSum += nm.effectiveness;
                        knm = classifiers.calculate_k_NM(req.body.k, trainingSet[i], testSet[i]);
                        knmSum += knm.effectiveness;


                        break;
                }
            }
            switch (req.body.classifier) {
                case "nn":
                    output += '<br>' + '[NN] ' + (nnSum / trainingSet.length) + '%';
                    break;
                case "knn":
                    output += '<br>' + '[kNN, k = ' + req.body.k + '] ' + (knnSum / trainingSet.length) + '%';
                    break;
                case "nm":
                    output += '<br>' + '[NM] ' + (nmSum / trainingSet.length) + '%';
                    break;
                case "knm":
                    output += '<br>' + '[kNM, k = ' + req.body.k + '] ' + (knmSum / trainingSet.length) + '%';
                    break;
                default:
                    output += '<br>' + '[NN] ' + (nnSum / trainingSet.length) + '%';
                    output += '<br>' + '[kNN, k = ' + req.body.k + '] ' + (knnSum / trainingSet.length) + '%';
                    output += '<br>' + '[NM] ' + (nmSum / trainingSet.length) + '%';
                    output += '<br>' + '[kNM, k = ' + req.body.k + '] ' + (knmSum / trainingSet.length) + '%';
            }
        }
        else {
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
                    output += '<br>' + '[kNM, k = ' + req.body.k + '] ' + classifiers.calculate_k_NM(req.body.k, trainingSet, testSet)['message'];
                    break;
                case "all":

                    console.log(testSet.length, trainingSet.length);
                    output += '<br>' + '[NN] ' + parseInt(classifiers.calculate_NN(trainingSet, testSet)['effectiveness']) + '%';
                    output += '<br>' + '[kNN, k = ' + req.body.k + '] ' + parseInt(classifiers.calculate_k_NN(req.body.k, trainingSet, testSet)['effectiveness']) + '%';
                    output += '<br>' + '[NM] ' + parseInt(classifiers.calculate_NM(trainingSet, testSet)['effectiveness']) + '%';
                    output += '<br>' + '[kNM, k = ' + req.body.k + '] ' + parseInt(classifiers.calculate_k_NM(req.body.k, trainingSet, testSet)['effectiveness']) + '%';
                    break;
            }
        }

    }
    else {

        let sets = null;
        switch (req.body.generate_data) {
            case "percentage":
                sets = train.generateTrainAndTestSet(data.classes,
                    req.app.get('selected_features'),
                    req.body.train_part);
                output += '<br>[Train] Test and training set was generated!';
                break;
            case "bootstrap":
                sets = train.generateTrainAndTestSetBootstrap(data.classes,
                    req.app.get('selected_features'),
                    req.body.train_part);
                output += '<br>[Bootstrap] Test and training set was generated!';
                break;
            case "crossvalidation":
                sets = train.generateTrainAndTestSetCrossValidation(data.classes,
                    req.app.get('selected_features'),
                    req.body.train_part,
                    req.body.cross_part);
                output += '<br>[Cross-Validation] Test and training set was generated!';
                break;
        }

        req.app.set('training_set', sets.trainSet);
        req.app.set('test_set', sets.testSet);
    }


    res.app.set('output', output);

    res.render('classifiers', {
        features: featuresAsString,
        train_part: req.app.get('train_part'),
        classifier: req.app.get('classifier') ? req.app.get('classifier') : 'nn',
        k: req.app.get('k') ? req.app.get('k') : 1,
        output: output,
        executeEnabled: req.app.get('training_set') && req.app.get('training_set').length > 0 && req.app.get('test_set') && req.app.get('test_set').length > 0,
        generate_data: req.body.generate_data ? req.body.generate_data : req.app.get('generate'),
        cross_part: req.body.cross_part ? req.body.cross_part : 5
    });

});

function getFeaturesAsString(req) {

    let selectedFeatures = req.app.get('selected_features');
    if (!selectedFeatures || selectedFeatures.length === 0) {
        return false;
    }

    let featuresAsString = '';
    selectedFeatures.forEach(function (feature) {
        featuresAsString += 'c' + feature + ', ';
    });

    return featuresAsString;
}


module.exports = router;
