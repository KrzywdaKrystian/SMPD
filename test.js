var classifiers = require("./classifiers");
var fs = require('fs');

let trainSet = [];
let testSet = [];

fs.readFile('Maple_Oak.txt', 'utf8', function(err, data) {
    if (err) throw err;

    let d = data.split('\n');
    let result = [];
    let noObjects = 0;
    for(let i = 1; i < d.length; i++) { // samples

        let row = d[i].split(',');
        let name = row[0].split(' ')[0];
        if(!result[name]) {
            result[name] = [];
        }

        if(row.length > 1) {
            noObjects++;
            for(let j = 1; j < row.length; j++) { // features
                if(!result[name][j-1]) {
                    result[name][j-1] = [];
                }
                result[name][j-1].push(parseFloat(row[j]));
            }
        }
    }

    let classObjects = [];

    for(let items in result) {
        if(result[items].length > 0) {
            classObjects.push(result[items]);
        }
    }


    let trainPart = 70;
    let selectedFeatures = [31, 15, 33, 60];
    data = {
        classes: classObjects,
        noClasses: classObjects.length,
        noObjects: noObjects,
        noFeatures: classObjects[0].length,
    };



    data.classes.forEach(function (classObj, classIndex) {
        // get random indexes to trainSet
        console.log(classIndex);
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

    console.log(testSet.length, trainSet.length);


    let nn = classifiers.calculate_NN(trainSet, testSet);
    console.log('nn, ' + nn.effectiveness);
    let knn = classifiers.calculate_k_NN(7, trainSet, testSet);
    console.log('knn ' + knn.effectiveness);
    let nm = classifiers.calculate_NM(trainSet, testSet);
    console.log('nm ' + nm.effectiveness);
    let knm = classifiers.calculate_k_NM(7, trainSet, testSet);
    console.log('knn ' + knm.effectiveness);

});



function getRandomIndexes(n, max) {
    let arr = [];
    while (arr.length < n) {
        let randomnumber = Math.floor(Math.random() * max);
        if (arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    return arr;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(getRandomInt(0,1));