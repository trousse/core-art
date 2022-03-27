const Categories10 = require('./data/categories_10_5.js');
const Categories3 = require("./data/categories_3_5.js");
twig = require('twig');

const categories10 = Categories10;
const categories3 = Categories3;

console.log(categories3)

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.set('trust proxy', 1) // trust first proxy

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge:1000*60*60 }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function (req,res,next){
 /* if(!req.session.code && req.url !=='/auth'){
    res.redirect('/auth');
  } else{ */
    //recupere data
    let number = Math.trunc(Math.random() * 8 - 0.01);
    let Menu = { horizontal: false, highNbMenu: true, submenu: true};
    let config = {
        url:"http://153.92.222.80"
    }
   /* console.log(number);
    for (const menuKey in Menu) {
      Menu[menuKey] = number % 2 === 1;
      number = Math.trunc(number/2);
    }*/
    if(req.session.chart){
        req.session.chart.total = req.session.chart.reduce((total, current, index) => {
            return total + parseFloat(req.session.chart[index].product.prix);
        },0).toFixed(2).toString();
    }

    console.log(req.session.chart);

    req.data = {
      Menu: Menu,
      MenuData: Menu.highNbMenu ? categories10 : categories3,
        config: config,
        chart: req.session.chart || []
    }
    next();
  //}
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/parsedata', dataRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

twig.extendFunction("s", function(value) {
    return value.toString();
});

module.exports = app;
