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


    for(let i = 0; i < noFeatures; i++){

        let numerator = vectorOfAveragesForClass[0][i] - vectorOfAveragesForClass[1][i];
        let denominator = standardDeviation[0][i] + standardDeviation[1][i];

        fisher[i] = numerator / denominator;

        if(bestFisherValue < fisher[i]) {
            bestFisherValue = fisher[i];
            bestFisherIndex = i;
        }

        console.log(i + ' ' + fisher[i]);
    }



    return 'Fisher 1D result: ' + 'Feature number: ' + bestFisherIndex + ' with value: ' + bestFisherValue;
}

function calculateND(classes, featuresNumber) {

    let vectorOfAveragesForClass = [];
    let scatterMatrixForClass = [];
    let covarianceMatrixForClass = [];

    classes.forEach(function (classObj, index) {
        // Krok 1 - oblicz wktor srednich
        vectorOfAveragesForClass[index] = methods.getVectorOfAverages(classObj);
        // Krok 2 - oblicz macierz rozrzutu
        scatterMatrixForClass[index] = methods.getScatterMatrix(classObj, vectorOfAveragesForClass[index]);
        // Krok 3 - oblicz macierz kowariancji
        covarianceMatrixForClass[index] = methods.getMatrixCovariance(scatterMatrixForClass[index]);

        // console.log('Wektor srednich dla klasy ' + index );
        // methods.drawMatrix(covarianceMatrixForClass[index]);
    });


    if(classes.length === 2) {

    }


    return 'results';
}

module.exports = {
    calculate1D: calculate1D,
    calculateND: calculateND
};