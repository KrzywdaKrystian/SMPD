function calculate_NN(trainSet, testSet) {

    let countSuccess = 0;
    let countFail = 0;

    for (let i = 0; i < testSet.length; i++) {
        let tmp = 999999999;
        let tmpClassIndex = null;

        trainSet.forEach(function (trainSetFromClass, classIndex) {

            trainSetFromClass.forEach(function (sample, sampleIndex) {
                let distance = Math.sqrt(Math.pow(testSet[i]['value'] - sample, 2));
                if (distance <= tmp) {
                    tmp = distance;
                    tmpClassIndex = classIndex;
                }
            });

        });

        if (tmpClassIndex === testSet[i]['orginal_class_index']) {
            countSuccess++;
        }
        else {
            countFail++;
        }
    }

    // console.log('nn', countSuccess, countFail);

    return {
        effectiveness: countSuccess / (countSuccess + countFail) * 100,
        message: 'Effectiveness: ' + ( countSuccess / (countSuccess + countFail) * 100 ) + '%'
    };
}

function calculate_k_NN(k, trainSet, testSet) {


    let countSuccess = 0;
    let countFail = 0;

    for (let i = 0; i < testSet.length; i++) {
        let tmp = 999999999;
        let tmpClassIndex = null;
        let distances = [];
        trainSet.forEach(function (trainSetFromClass, classIndex) {

            trainSetFromClass.forEach(function (sample, sampleIndex) {
                let distance = Math.sqrt(Math.pow(testSet[i]['value'] - sample, 2));
                if (distance <= tmp) {
                    tmp = distance;
                    tmpClassIndex = classIndex;
                    distances.push({
                        distance: distance,
                        classIndex: classIndex
                    })
                }
            });

        });

        distances = distances.reverse();

        // only for two classes
        let str = "";
        let max = k > distances.length ? k : distances.length;
        for (let j = 0; j < max; j++) {
            if (distances[j] && distances[j]['classIndex']) {
                str += distances[j]['classIndex'] + ' ';
            }
        }

        let a = (str.match(/0/g) || []).length;
        let b = (str.match(/1/g) || []).length;

        let winnerClass = a > b ? 0 : 1;

        if (winnerClass === testSet[i]['orginal_class_index']) {
            countSuccess++;
        }
        else {
            countFail++;
        }
    }


    return {
        effectiveness: (countSuccess / (countSuccess + countFail)) * 100,
        message: 'Effectiveness: ' + ( countSuccess / (countSuccess + countFail) * 100 ) + '%'
    };
}

function calculate_NM(trainSet, testSet) {

    let countSuccess = 0;
    let countFail = 0;

    let means = [];
    // means for class
    for (let i = 0; i < trainSet.length; i++) {
        let sum = 0;
        for (let j = 0; j < trainSet[i].length; j++) {
            sum += trainSet[i][j];
        }
        means[i] = sum / trainSet[i].length;
    }

    for (let i = 0; i < testSet.length; i++) {
        let tmp = 999999999;
        let tmpClassIndex = null;

        means.forEach(function (mean, classIndex) {
            let distance = Math.sqrt(Math.pow(testSet[i]['value'] - mean, 2));
            if (distance < tmp) {
                tmp = distance;
                tmpClassIndex = classIndex;
            }
        });

        if (tmpClassIndex === testSet[i]['orginal_class_index']) {
            countSuccess++;
        }
        else {
            countFail++;
        }
    }

    // console.log('nm', countSuccess, countFail);

    return {
        effectiveness: (countSuccess / (countSuccess + countFail)) * 100,
        message: 'Effectiveness: ' + ( countSuccess / (countSuccess + countFail) * 100 ) + '%'
    };
}

// https://www.youtube.com/watch?v=xnWFIgr34Lk
// https://www.youtube.com/watch?v=fzxnoDPNnvA
// 1. ustalamy k
// 2. Wybieramy k losowych centroidów dla każdej klasy
// 3. Dla każdej próbki z każdej klasy liczymy odległość euklidesa do każdego centroida
// 4. Przypisujemy próbkę do najbliższego centroida
//
function calculate_k_NM(k, trainSet, testSet) {

    let generateClusterCenters = function (classObj, k) {

        let random = [];
        let randomClusterCenters = [];

        while (random.length < k) {
            let randIndex = parseInt(Math.floor(Math.random() * classObj.length));
            if (random.indexOf(randIndex) < 0) {
                random.push(randIndex);
            }
        }

        random.forEach(function (sampleIndex) {
            randomClusterCenters.push(classObj[sampleIndex]);
        });

        return randomClusterCenters;

    };

    let updateClusterCenters = function (classObj, k, iterationSelectionResult) {

        let clusterCenters = [];
        let clusterValues = [];

        for (let i = 0; i < k; i++) {
            clusterValues[i] = [];
        }

        for (let i = 0; i < iterationSelectionResult.length; i++) {
            clusterValues[iterationSelectionResult[i]].push(classObj[i]);
        }

        for (let i = 0; i < k; i++) {
            let sum = 0;
            for (let j = 0; j < clusterValues[i].length; j++) {
                sum += clusterValues[i][j];
            }
            clusterCenters[i] = clusterValues[i].length > 0 ? sum / clusterValues[i].length : 0;
        }

        return clusterCenters;
    };

    let calculateEuklides = function (k, clusterCenters, classObj) {
        let result = [];

        for (let i = 0; i < k; i++) {
            result[i] = [];
            classObj.forEach(function (sample) {
                result[i].push(Math.sqrt(Math.pow((clusterCenters[i] - sample), 2)))
            })
        }

        return result;
    };

    let compare = function (arr1, arr2) {
        if (arr1 !== null && arr2 !== null) {
            if (arr1.length !== arr2.length) {
                // not the same
                return false;
            }
            else {
                for (let i = 0; i < arr1.length; i++) {
                    if (arr1[i] !== arr2[i]) {
                        // not the same
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    };

    let calculateMahanolobis = function (sample, mean, samplesCount) {
        let covariantMatrix = (1.0 / samplesCount) * (sample - mean);
        return (sample - mean) * (1.0 / covariantMatrix) * (sample - mean);
    };

    let classMeans = [];
    let countSuccess = 0;
    let countFail = 0;

    trainSet.forEach(function (classObj, classIndex) {
        let clusterCenters = generateClusterCenters(classObj, k);
        let distances = calculateEuklides(k, clusterCenters, classObj);

        // tablica indexSample(key) : clusterIndex(value)
        let iterationSelectionResult = [];
        let changed = true;

        let changedCounter = 0;
        while (changed) {
            // console.log("akcja", classIndex, changedCounter);
            let tmpIterationSelectionResult = [];
            for (let sampleIndex = 0; sampleIndex < classObj.length; sampleIndex++) {
                let tmp = 999999999;
                let tmpClusterIndex;
                // centroidy
                for (let clusterIndex = 0; clusterIndex < k; clusterIndex++) {
                    let tmpDistance = distances[clusterIndex][sampleIndex];

                    if (tmpDistance < tmp) {
                        tmp = tmpDistance;
                        tmpClusterIndex = clusterIndex;
                    }
                }
                tmpIterationSelectionResult[sampleIndex] = tmpClusterIndex;
            }

            changed = !compare(iterationSelectionResult, tmpIterationSelectionResult);
            iterationSelectionResult = [];
            tmpIterationSelectionResult.forEach(function (v) {
                iterationSelectionResult.push(v);
            });

            // console.log(changed, tmpIterationSelectionResult);
            clusterCenters = updateClusterCenters(classObj, k, iterationSelectionResult);
            distances = calculateEuklides(k, clusterCenters, classObj);
            changedCounter++;
        }

        classMeans[classIndex] = clusterCenters;

    });


    for (let i = 0; i < testSet.length; i++) {

        let results = [];

        let winnerClass = null;

        classMeans.forEach(function (classMean, classIndex) {

            results[classIndex] = [];
            classMean.forEach(function (mean) {
                // results[classIndex].push(calculateMahanolobis(testSet[i]['value'], mean, trainSet[classIndex].length));
                results[classIndex].push(Math.sqrt(Math.pow((mean - testSet[i]['value']), 2)));
            });

            let minValue = 999999999;

            for (let j = 0; j < results.length; j++) {
                results[j].forEach(function (value) {
                    if (value < minValue) {
                        minValue = value;
                        winnerClass = classIndex;
                    }
                })
            }
        });

        if (winnerClass === testSet[i]['orginal_class_index']) {
            countSuccess++;
        }
        else {
            countFail++;
        }

    }

    // console.log('knm', countSuccess, countFail);

    return {
        effectiveness: (countSuccess / (countSuccess + countFail)) * 100,
        message: 'Effectiveness: ' + ( countSuccess / (countSuccess + countFail) * 100 ) + '%'
    };
}


module.exports = {
    calculate_NN: calculate_NN,
    calculate_k_NN: calculate_k_NN,
    calculate_NM: calculate_NM,
    calculate_k_NM: calculate_k_NM
};

