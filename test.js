var classifiers = require("./classifiers");
var train = require("./train");
var fs = require('fs');

var process = require('process');

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


    process.argv.forEach(function (val, index, array) {
        if(index == 2) {
            let sets = null;
            switch (val) {
                case "train":
                    console.log('train generated');
                    sets = train.generateTrainAndTestSet(data.classes, selectedFeatures, trainPart);
                    testSet = sets.testSet;
                    trainSet = sets.trainSet;
                    run();
                    break;
                case "bootstrap":
                    console.log('bootstrap generated');
                    sets = train.generateTrainAndTestSetBootstrap(data.classes, selectedFeatures, trainPart);
                    testSet = sets.testSet;
                    trainSet = sets.trainSet;
                    run();
                    break;
                case "cross":
                    console.log('crossvalidation generated');
                    sets = train.generateTrainAndTestSetCrossValidation(data.classes, selectedFeatures, trainPart, 5);

                    let nnSum = 0;
                    let knnSum = 0;
                    let nmSum = 0;
                    let knmSum = 0;
                    for(let i = 0; i < sets.trainSet.length; i++){
                        // console.log(i);

                        let nn = classifiers.calculate_NN(sets.trainSet[i], sets.testSet[i]);
                        nnSum += nn.effectiveness;
                        let knn = classifiers.calculate_k_NN(7, sets.trainSet[i], sets.testSet[i]);
                        knnSum += knn.effectiveness;
                        let nm = classifiers.calculate_NM(sets.trainSet[i], sets.testSet[i]);
                        nmSum += nm.effectiveness;
                        let knm = classifiers.calculate_k_NM(7, sets.trainSet[i], sets.testSet[i]);
                        knmSum += knm.effectiveness;
                    }

                    console.log('nn, ' + (nnSum/sets.trainSet.length));

                    console.log('knn, ' + (knnSum/sets.trainSet.length));

                    console.log('nm, ' + (nmSum/sets.trainSet.length));

                    console.log('knn, ' + (knmSum/sets.trainSet.length));
                    break;
                default:
                    console.log('-----__ERROR_-----');
            }




            function run() {
                let nn = classifiers.calculate_NN(trainSet, testSet);
                console.log('nn, ' + nn.effectiveness);
                let knn = classifiers.calculate_k_NN(7, trainSet, testSet);
                console.log('knn ' + knn.effectiveness);
                let nm = classifiers.calculate_NM(trainSet, testSet);
                console.log('nm ' + nm.effectiveness);
                let knm = classifiers.calculate_k_NM(7, trainSet, testSet);
                console.log('knn ' + knm.effectiveness);
            }
        }
    });

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
