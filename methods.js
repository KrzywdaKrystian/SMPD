function drawMatrix(matrix) {
    var str = "";
    matrix.forEach(function (row, i) {
        row.forEach(function (column, j) {
            str += matrix[i][j] + ', ';
        });
        str += '\n';
    });
    console.log(str);
}

function getVectorOfAverages(c) {

    let vector = [];
    c.forEach(function (feature, index) {
        var sumOfSamples = 0;
        feature.forEach(function (sample) {
            sumOfSamples += sample;
        });
        vector[index] = sumOfSamples / feature.length;

    });
    return vector;
}

function getStandardDeviation(c) {

    let standardDeviation = [];
    c.forEach(function (feature, index) {
        let sum = 0;
        feature.forEach(function (sample) {
            sum += sample * sample;
        });
        standardDeviation[index] = Math.sqrt(sum / feature.length);
    });

    return standardDeviation;
}

function getScatterMatrix(matrix, averageVector) {

    var scatterMatix = [];
    matrix.forEach(function (row, i) {
        scatterMatix[i] = [];
        row.forEach(function (column, j) {
            scatterMatix[i][j] = matrix[i][j] - averageVector[i];
        });
    });

    return scatterMatix;
}

function getMatrixCovariance(scatterMatrix) {

    function sum(x1, x2) {
        let s = 0;
        for(let i = 0; i < x1.length; i++) {
            s += x1[i] * x2[i];
        }

        return s / x1.length;
    }

    let matrixCovariance = [];
    scatterMatrix.forEach(function (x1, i) {
        matrixCovariance[i] = [];
        scatterMatrix.forEach(function (x2, j) {
            matrixCovariance[i][j] = sum(x1, x2);
        });
    });

    return matrixCovariance;
}

module.exports = {
    drawMatrix: drawMatrix,
    getVectorOfAverages: getVectorOfAverages,
    getStandardDeviation: getStandardDeviation,
    getScatterMatrix: getScatterMatrix,
    getMatrixCovariance: getMatrixCovariance
};