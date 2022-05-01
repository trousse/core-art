#!/usr/bin/env node

const Categories10 = require('./data/categories_10_5.js');
const Categories3 = require("./data/categories_3_5.js");
const Watcher = require('./model/watcher');
var http = require('http');
var ServerIO = require('socket.io');


twig = require('twig');

const categories10 = Categories10;
const categories3 = Categories3;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const bodyParser = require("body-parser");
const watcher = new Watcher();


var indexRouter = require('./routes/index');
var chartRouter = require('./routes/chart');
var dataRouter = require('./routes/data');
var clickRouter = require('./routes/click');

var app = express();
var port = normalizePort('3000');
app.set('port', port);

var server = http.createServer(app);
var io = new ServerIO.Server(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.set('trust proxy', 1) // trust first proxy

var fileStoreOptions = {};
var SessionStore = new FileStore(fileStoreOptions);
const maxSessionAge = 1000*60*60;
const sessionMiddleware = session({
    store: SessionStore,
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: false, maxAge: maxSessionAge }
})

app.use(sessionMiddleware)

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

io.on("connection", (socket) => {
    var count = -1
    let isConnect = true
    socket.emit('ping');
    socket.on('pong',(attr)=>{
        isConnect = true;
        count++
        setTimeout(() => {
            isConnect =  false;
            socket.emit('ping')
        },1000)
        setTimeout(() => {
            if(!isConnect){
                socket.request.session.reload(()=>{
                    let array = socket.request.session[attr] || [];
                    array.push(count);
                    socket.request.session[attr] = array;
                    socket.request.session.save(()=>{
                        console.log(socket.request.session[attr] );
                    })
                })
            }
        },1098);
    })
});

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
    //recupere data//let number = Math.trunc(Math.random() * 8 - 0.01);
    let Menu = { horizontal: true, highNbMenu: true, submenu: false};
    let number = (Menu.horizontal ? 1 : 0) + (Menu.highNbMenu ? 2 : 0) + (Menu.submenu ? 4 : 0);
    let config = {
        url:"http://localhost:3000"
    }

    if(!req.session.connectDateTime){
        req.session.MenuNumber = number;
        req.session.connectDateTime = Date.now();
        req.session.click = 0;
        req.session.clickMenu = 0;
        req.session.pageVisited = 0;
        req.session.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        setTimeout(()=>{
            console.log("session")
            SessionStore.get(req.session.id,(error,session)=>{
                if(error)console.log(error);
                else watcher.writeCSV(req,session);
            });
        },maxSessionAge);
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

    req.data = {
        Menu: Menu,
        scripts: ['allping.js'],
        MenuData: Menu.highNbMenu ? categories10 : categories3,
        config: config,
        chart: req.session.chart || []
    }
    next();
  //}
});

app.use('/', indexRouter);
app.use('/parsedata', dataRouter);
app.use('/chart', chartRouter);
app.use('/click',clickRouter);

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

server.listen(port);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}