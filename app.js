var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var methods = require('./methods');

var preprocessing = require('./routes/preprocessing');
var features_selection = require('./routes/features_selection');
var classifiers = require('./routes/classifiers');

var app = express();

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

    app.set('data', {
        classes: classObjects,
        noClasses: classObjects.length,
        noObjects: noObjects,
        noFeatures: classObjects[0].length,
    });

    app.set('train_part', 80);

    for(let x = 0; x < classObjects.length; x++) {
        for(let y = 0; y < classObjects[x].length; y++) {
            for(let z = 0; z < classObjects[x][y].length; z++) {
                if(isNaN(classObjects[x][y][z])){
                    console.error('Klasa: ' + x + ' cecha: ' + y + ' isNan', classObjects[x][y][z]);
                }
            }
        }

    }


});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/preprocessing', preprocessing);
app.use('/features-selection', features_selection);
app.use('/', features_selection);
app.use('/classifiers', classifiers);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
