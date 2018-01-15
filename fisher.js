var methods = require('./methods');

function calculate(classess) {

    let vectorOfAveragesForClass = [];
    let scatterMatrixForClass = [];
    let covarianceMatrixForClass = [];

    classess.forEach(function (classObj, index) {
        // Krok 1 - oblicz wktor srednich
        vectorOfAveragesForClass[index] = methods.getVectorOfAverages(classObj);
        // Krok 2 - oblicz macierz rozrzutu
        scatterMatrixForClass[index] = methods.getScatterMatrix(classObj, vectorOfAveragesForClass[index]);
        // Krok 3 - oblicz macierz kowariancji
        covarianceMatrixForClass[index] = methods.getMatrixCovariance(scatterMatrixForClass[index]);

        console.log('Wektor srednich dla klasy ' + index );
        methods.drawMatrix(covarianceMatrixForClass[index]);
    });


    if(classess.length === 2) {
        // Krok 4 - oblicz wspolczynik Fishera

    }


    return 'results';
}

module.exports = {
    calculate: calculate
};