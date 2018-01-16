var methods = require('./methods');
var math = require('mathjs');

// http://mathjs.org/docs/reference/functions/det.html

function calculate1D(classes, noFeatures) {

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

    return 'Fisher 1D result: Feature number: ' + bestFisherIndex + ' with value: ' + bestFisherValue;
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

function calculateND(classes, featuresNumber, noFeatures) {


    let set = [];

    for (let i = 0; i < noFeatures; i++) {
        set.push(i);
    }

    let combinations = getCombinations(set, featuresNumber);


    let matrix = [];
    let fisher;
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

    let str = '';
    fisherCombination.forEach(function (obj) {
       str += 'c'+obj;
    });

    return 'Fisher ' + featuresNumber + 'D result: ' + str;
}

module.exports = {
    calculate1D: calculate1D,
    calculateND: calculateND
};


function getCombinations(set, k) {
    var i, j, combs, head, tailcombs;

    if (k > set.length || k <= 0) {
        return [];
    }

    if (k == set.length) {
        return [set];
    }

    if (k == 1) {
        combs = [];
        for (i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }

    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
        head = set.slice(i, i + 1);
        tailcombs = getCombinations(set.slice(i + 1), k - 1);
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
}

