var methods = require('./methods');
var math = require('mathjs');

// http://mathjs.org/docs/reference/functions/det.html

function calculateFisher1D(classes, noFeatures) {

    let vectorOfAveragesForClass = [];
    let standardDeviation = [];
    let fisher = [];
    let bestFisherIndex = null;
    let bestFisherValue = null;

    classes.forEach(function (classObj, index) {
        vectorOfAveragesForClass[index] = methods.getVectorOfAverages(classObj);
        standardDeviation[index] = methods.getStandardDeviation(classObj);
    });

    for (let i = 0; i < noFeatures; i++) {

        let numerator = vectorOfAveragesForClass[0][i] - vectorOfAveragesForClass[1][i];
        let denominator = standardDeviation[0][i] + standardDeviation[1][i];

        fisher[i] = numerator / denominator;

        if (bestFisherValue < fisher[i]) {
            bestFisherValue = fisher[i];
            bestFisherIndex = i;
        }
    }

    return {
        bestFisherIndex: bestFisherIndex,
        bestFisherValue: bestFisherValue,
        message: 'Fisher 1D result: Feature number: ' + bestFisherIndex + ' with value: ' + bestFisherValue,
    }
}

function getNumeratorForFisherND(uA, uB) {
    let arr = [];
    for (let i = 0; i < uA.length; i++) {
        arr[i] = uA[i] - uB[i];
    }

    let sum = 0;
    for (let j = 0; j < arr.length; j++) {
        sum += arr[j] * arr[j];
    }

    return Math.sqrt(sum);
}

function calculateFisherND(classes, featuresNumber, noFeatures) {

    let set = [];

    for (let i = 0; i < noFeatures; i++) {
        set.push(i);
    }

    let combinations = methods.getCombinations(set, featuresNumber);

    let fisherCombination = calculateFisherNDLogic(classes, combinations).fisherCombination;

    let str = '';
    fisherCombination.forEach(function (obj) {
       str += 'c'+obj;
    });

    return {
        features: fisherCombination,
        message: 'Fisher ' + featuresNumber + 'D result: ' + str
    }
}

function calculateFisherNDLogic(classes, combinations) {

    let matrix = [];
    let fisher = null;
    let fisherCombination = [];

    let vectorOfAveragesForClass = [];
    let scatterMatrixForClass = [];
    let covarianceMatrixForClass = [];

    combinations.forEach(function (combination) {

        classes.forEach(function (classObj, index) {

            matrix[index] = [];
            combination.forEach(function (com) {
                matrix[index].push(classObj[com]);
            });

            vectorOfAveragesForClass[index] = methods.getVectorOfAverages(matrix[index]);
            scatterMatrixForClass[index] = methods.getScatterMatrix(matrix[index], vectorOfAveragesForClass[index]);
            covarianceMatrixForClass[index] = methods.getMatrixCovariance(scatterMatrixForClass[index]);

        });

        let numerator = getNumeratorForFisherND(vectorOfAveragesForClass[0], vectorOfAveragesForClass[1]);
        let denominator = math.det(covarianceMatrixForClass[0]) + math.det(covarianceMatrixForClass[1]);

        let tmpFisher = numerator / denominator;

        if(!fisher) {
            fisher = tmpFisher;
            fisherCombination = combination;
        }
        if(fisher < tmpFisher) {
            fisher = tmpFisher;
            fisherCombination = combination;
        }
    });

    return {
        fisher: fisher,
        fisherCombination: fisherCombination
    }
}

function calculateSFS(classes, featuresNumber, noFeatures) {

    let result = calculateFisher1D(classes, noFeatures);
    let bestFeature = result.bestFisherIndex;

    if(featuresNumber === 1) {
        return {
            message: 'SFS 1D result: Feature number: ' + bestFeature + ' is winner',
        }
    }
    else {
        let best = [bestFeature];

        for(let i = 0; i < featuresNumber - 1; i++) {
            let tmp = [];
            for(let j = 0; j < noFeatures; j++) {
                if(best.indexOf(j) < 0) {
                    tmp.push(best.concat([j]));
                }
            }
            let result = calculateFisherNDLogic(classes, tmp);
            best = result.fisherCombination;
        }

        let str = '';
        best.forEach(function (obj) {
            str += 'c'+obj;
        });

        return {
            features: best,
            message: 'SFS ' + featuresNumber + 'D result: ' + str
        }
    }
}

module.exports = {
    calculateFisher1D: calculateFisher1D,
    calculateFisherND: calculateFisherND,
    calculateSFS: calculateSFS
};

