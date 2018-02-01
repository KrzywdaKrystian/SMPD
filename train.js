function generateTrainAndTestSet(classes, selectedFeatures, trainPart, selectedIndexes) {

    let trainSet = [];
    let testSet = [];

    classes.forEach(function (classObj, classIndex) {
        let trainSetIndexes = selectedIndexes && selectedIndexes[classIndex] ?
            // from bootstrap or cross-validation
            selectedIndexes[classIndex] :
            // train with %
            getRandomIndexes(classObj[0].length * trainPart / 100, classObj[0].length);

        // get random indexes to trainSet
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

    return {
        trainSet: trainSet,
        testSet: testSet
    }
}

function generateTrainAndTestSetBootstrap(classes, selectedFeatures, trainPart) {

    let randomIndexes = [];
    classes.forEach(function (classObj, classIndex) {
        randomIndexes[classIndex] = [];

        for (let i = 0; i < classObj[0].length; i++) {
            randomIndexes[classIndex].push(getRandomInt(0, classObj[0].length - 1));
        }

    });

    return generateTrainAndTestSet(classes, selectedFeatures, trainPart, randomIndexes)
}

function generateTrainAndTestSetCrossValidation(classes, selectedFeatures, trainPart, crossPart) {

    let trainSet = [];
    let testSet = [];

    for(let i = 0; i < crossPart; i++) {
        trainSet[i] = [];
        testSet[i] = [];
    }

    classes.forEach(function (classObj, classIndex) {


        let countSamplesPerPart = classObj[0].length / crossPart;
        let start = 0;
        let end = countSamplesPerPart;
        for(let i = 0; i < crossPart; i++) {
            trainSet[i][classIndex] = [];
            start = i * countSamplesPerPart;
            end = (i+1) * countSamplesPerPart;
            // console.log(start, end);
            // each class
            classObj.forEach(function (feature, featureIndex) {

                // only selected features
                if (selectedFeatures.indexOf(featureIndex) > -1) {

                    feature.forEach(function (sample, sampleIndex) {

                        // only selected samples
                        if (sampleIndex >= start && sampleIndex < end) {
                            trainSet[i][classIndex].push(sample);
                        }
                        else {
                            testSet[i].push({
                                value: sample,
                                orginal_class_index: classIndex
                            })
                        }
                    })
                }
            })
        }

    });


    return {
        trainSet: trainSet,
        testSet: testSet
    }
}

function getRandomIndexes(n, max) {
    let arr = [];
    while (arr.length < n) {
        let randomnumber = Math.floor(Math.random() * max) + 1;
        if (arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    return arr;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    generateTrainAndTestSet: generateTrainAndTestSet,
    generateTrainAndTestSetBootstrap: generateTrainAndTestSetBootstrap,
    generateTrainAndTestSetCrossValidation: generateTrainAndTestSetCrossValidation
};

