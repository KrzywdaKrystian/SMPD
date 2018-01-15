var methods = require('./methods');
var math = require('mathjs');

// http://mathjs.org/docs/reference/functions/det.html

function calculate(classes, featuresNumber) {

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

        console.log('Wektor srednich dla klasy ' + index );
        methods.drawMatrix(covarianceMatrixForClass[index]);
    });


    if(classes.length === 2) {

    }


    return 'results';
}

module.exports = {
    calculate: calculate
};