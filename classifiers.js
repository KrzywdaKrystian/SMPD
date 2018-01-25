function calculate_NN(trainSet, testSet) {

    let countSuccess = 0;
    let countFail = 0;

    for(let i = 0; i < testSet.length; i++) {
        let tmp = null;
        let tmpClassIndex = null;

        trainSet.forEach(function (testSetFromClass, classIndex) {

            testSetFromClass.forEach(function (sample, sampleIndex) {
                let distance = Math.sqrt(Math.pow(testSet[i]['value'] - sample, 2));
                if(tmp === null || distance <= tmp) {
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
        effectiveness: countSuccess/testSet.length,
        message: 'Effectiveness: ' + countSuccess/testSet.length + '%'
    };
}

function calculate_k_NN(k, trainSet, testSet) {

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

        });
        // sort
        distances = distances.sort(function(a, b){
            let keyA = new Date(a.distance),
                keyB = new Date(b.distance);
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });

        // check

        for(let j = 0; j < k; j++) {
            if(tmp === null || distances[j]['distance'] <= tmp) {
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
        effectiveness: countSuccess/testSet.length,
        message: 'Effectiveness: ' + countSuccess/testSet.length + '%'
    };
}

function calculate_NM(noClasses, trainingSet, testSet) {

    return {
        'message' : 'calculate_NM'
}
}

function calculate_k_NM(noClasses, trainingSet, testSet) {

    return {
        'message' : 'calculate_k_NM'
    }
}


module.exports = {
    calculate_NN: calculate_NN,
    calculate_k_NN: calculate_k_NN,
    calculate_NM: calculate_NM,
    calculate_k_NM: calculate_k_NM
};

