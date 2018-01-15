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
    for(let i = 1; i < d.length; i++) {

        let row = d[i].split(',');
        let name = row[0].split(' ')[0];
        if(!result[name]) {
            result[name] = [];
        }

        let tmp = '';
        if(row.length > 1) {
            noObjects++;
            for(let j = 1; j < row.length; j++) {
                if(!result[name][j-1]) {
                    result[name][j-1] = [];
                }
                result[name][j-1].push(row[j]);
                tmp += j + ' ';
            }
        }
    }

    let classObjects = [];

    for(let items in result) {
        if(result[items].length > 0) {
            classObjects.push(result[items]);
        }
    }

    console.log(classObjects[0][0]);

    app.set('data', {
        /*classes: [
            [
                /!* cecha 1 *!/ [1, 1, 2, 1],
                /!* cecha 2 *!/ [-1, 0, -1, -1]
            ],
            [
                /!* cecha 1 *!/ [1, 1, 2, 2],
                /!* cecha 2 *!/ [1, 1, 2, 1]
            ]
        ],*/
        classes: classObjects,
        noClasses: classObjects.length,
        noObjects: noObjects,
        noFeatures: classObjects[0].length,
    });


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
