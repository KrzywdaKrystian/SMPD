let trainPart = 50;
let selectedFeatures = [1, 2, 3];
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

// console.log(testSet);


function execute_NN(trainSet, testSet) {

    let countSuccess = 0;
    let countFail = 0;

    for(let i = 0; i < testSet.length; i++) {
        let tmp = null;
        let tmpClassIndex = null;

        trainSet.forEach(function (testSetFromClass, classIndex) {

            testSetFromClass.forEach(function (sample, sampleIndex) {
                let distance = Math.sqrt(Math.pow(testSet[i]['value'] - sample, 2));
                if(tmp === null || distance < tmp) {
                    tmp = distance;
                    tmpClassIndex = classIndex;
                }
            });

        });

        if(tmpClassIndex === testSet[i]['orginal_class_index']) {
            countSuccess++;
        }
        else {
            countFail++;
        }
    }

    return {
        effectiveness: countSuccess/(countSuccess+countFail),
        message: 'Skutecznosc na poziomie: ' + countSuccess/(countSuccess+countFail)
    };
}

function execute_k_NN(k, trainSet, testSet) {

    let countSuccess = 0;
    let countFail = 0;

    for(let i = 0; i < testSet.length; i++) {
        let tmp = null;
        let tmpClassIndex = null;

        let distances = [];
        trainSet.forEach(function (testSetFromClass, classIndex) {


            testSetFromClass.forEach(function (sample, sampleIndex) {
                let distance = Math.sqrt(Math.pow(testSet[i]['value'] - sample, 2));
                distances.push({
                    distance: distance,
                    classIndex: classIndex
                });
            });

            // z posortowanej tablicy wybrac k elementow i sprawdzic do ktorej klasy czesciej przynalezy


        });

        distances = distances.sort(function(a, b){
            let keyA = new Date(a.distance),
                keyB = new Date(b.distance);
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
        for(let j = 0; j < k; j++) {
            if(tmp === null || distances[j]['distance'] < tmp) {
                tmp = distances[j]['distance'];
                tmpClassIndex = distances[j]['classIndex'];
            }
        }

        if(tmpClassIndex === testSet[i]['orginal_class_index']) {
            countSuccess++;
        }
        else {
            countFail++;
        }


    }
    return {
        effectiveness: countSuccess/(countSuccess+countFail),
        message: 'Skutecznosc na poziomie: ' + countSuccess/(countSuccess+countFail)
    };
}

// NN
let nn = execute_NN(trainSet, testSet);

let knn = execute_k_NN(10, trainSet, testSet);



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
    while(arr.length < n){
        let randomnumber = Math.floor(Math.random()*max) ;
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    return arr;
}

