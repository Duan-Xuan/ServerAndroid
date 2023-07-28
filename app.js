var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// su dung thu vien doc file env
require('dotenv').config();

var indexUsRouter = require('./routes/indexUs');
var indexSpRouter = require('./routes/indexPr');
var indexAcRouter = require('./routes/indexAc');
var apiAcRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1) // trust first proxy

app.use(session({
  secret: process.env.KEY_SESSION,
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}));

app.use('/', indexUsRouter);
app.use('/pr', indexSpRouter);
app.use('/ac', indexAcRouter);
app.use('/api', apiAcRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  // địa chỉ api:    /api/userxxxxxxx
  if (req.originalUrl.indexOf('/api') == 0) {
    res.json(
      {
        msg: err.message
      }
    );
  } else {
    res.render('error');
  }
});

module.exports = app;
