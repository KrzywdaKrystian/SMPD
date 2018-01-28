var classifiers = require("./classifiers");

let trainPart = 70;
let selectedFeatures = [0, 1, 2, 3];
let data = {
    classes: [
        // Acer
        [
            /* q0 */ [0, 1, 2, 4, 0, 4, 2, 1, 2, 4],
            /* q1 */ [1, 3, 2, 1, 4, 1, 3, 2, 0, 1], // zaznaczone
            /* q2 */ [3, 1, 1, 2, 2, 3, 0, 0, 2, 3], // zaznaczone
            /* q3 */ [0, 1, 3, 0, 1, 0, 1, 0, 0, 0]
        ],
        // Querqus
        [
            /* q0 */ [0, 1, 0, 3, 0, 1, 2, 4],
            /* q1 */ [0, 1, 2, 3, 4, 5, 6, 7], // zaznaczone
            /* q2 */ [7, 6, 5, 4, 3, 2, 1, 0], // zaznaczone
            /* q3 */ [7, 5, 3, 1, 3, 5, 7, 1]
        ]
    ]
};

let trainSet = [];
let testSet = [];

data.classes.forEach(function (classObj, classIndex) {
    // get random indexes to trainSet
    let trainSetIndexes = getRandomIndexes(classObj[0].length * trainPart / 100, classObj[0].length);
    // console.log('trainSetIndexes', trainSetIndexes);
    // build trainSet and testSet from selected features
    trainSet[classIndex] = [];

    // each class
    classObj.forEach(function (feature, featureIndex) {

        // only selected features
        if (selectedFeatures.indexOf(featureIndex) > -1) {
            // console.log('featureIndex', featureIndex);
            // each selected features
            // console.log('trainSetIndexes', trainSetIndexes[classIndex]);
            feature.forEach(function (sample, sampleIndex) {

                // only selected samples
                if (trainSetIndexes.indexOf(sampleIndex) > -1) {
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

// console.log(testSet);


let nn = classifiers.calculate_NN(trainSet, testSet);
console.log('nn, ' + nn.message, nn.effectiveness);
let knn = classifiers.calculate_k_NN(7, trainSet, testSet);
console.log('knn ' + knn.message, knn.effectiveness);
let nm = classifiers.calculate_NM(trainSet, testSet);
console.log('nm ' + nm.message, nm.effectiveness);
let knm = classifiers.calculate_k_NM(7, trainSet, testSet);
console.log('knn ' + knm.message, knm.effectiveness);


/*


let selectedFeatures = [1, 2];
let simpleData = data.classes[0];
let selectedData = [];
let samplesCount = null;

simpleData.forEach(function (feature, featureIndex) {
    if (selectedFeatures.indexOf(featureIndex) > -1) {
        selectedData.push(feature);
        samplesCount = feature.length;
    }
});

let selectedIndexes = getRandomIndexes(parseInt(samplesCount * trainPart / 100), samplesCount - 1);
let trainSet = [];
let testSet = [];

console.log('samplesCount', samplesCount * trainPart / 100, selectedIndexes.length);

selectedData.forEach(function (feature, featureIndex) {
    trainSet[featureIndex] = [];
    testSet[featureIndex] = [];
    feature.forEach(function (sample, sampleIndex) {
        if (selectedIndexes.indexOf(sampleIndex) < 0) {
            testSet[featureIndex].push(sample);
        }
        else {
            trainSet[featureIndex].push(sample);
        }
    });
});
console.log(selectedData);
console.log(selectedIndexes);
console.log(testSet);
console.log(trainSet);

function getRandomIndexes(n, max) {
    let arr = [];
    while (arr.length < n) {
        let randomnumber = Math.floor(Math.random() * max) + 1;

        if (arr.indexOf(randomnumber) > -1) continue;

        arr[arr.length] = randomnumber;
    }
    return arr;
}

function executeNN(testSet, trainSet) {

}*/


function getRandomIndexes(n, max) {
    let arr = [];
    while (arr.length < n) {
        let randomnumber = Math.floor(Math.random() * max);
        if (arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    return arr;
}

