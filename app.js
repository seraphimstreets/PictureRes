
var fs = require('fs');
var express = require('express')
var path = require('path');
var app = express()
var logger = require('morgan');
const cors = require('cors');
app.all('*', (req,res,next) => {
  if (req.secure){
    return next()
  }else{
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
})

const config = require('./config');
const mongoose = require('mongoose');
const mainRouter = require('./routes/mainPageRouter');
const imageRouter = require('./routes/imageRouter');
const userRouter = require('./routes/users');
const uploadRouter = require('./routes/uploadRouter');
const albumRouter = require('./routes/albumRouter');
const followerRouter = require("./routes/followerRouter");
const passport = require('passport');
var cookieParser = require('cookie-parser')
const url = 'mongodb://localhost:27017/pictureres';
const connect = mongoose.connect(url);
const session = require('express-session');

connect.then((db) => {
    console.log("Connected correctly to the MongoDB server");
}, (err) => { console.log(err); });


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, "./views")));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '/assets/images/')))
app.use(express.static(path.join(__dirname, '/assets/images/backgrounds/')))
app.use(express.static(path.join(__dirname, '/home')))
app.use('/images/imFind/', express.static(path.join(__dirname, '/')));
app.use('/images/imFind/', express.static(path.join(__dirname, '/assets/images/')));
app.use('/albums/', express.static(path.join(__dirname, '/')));
app.use('/albums/', express.static(path.join(__dirname, '/assets/images/')));
app.use('/albums/:albumId/', express.static(path.join(__dirname, '/')));
app.use('/albums/:albumId/', express.static(path.join(__dirname, '/assets/images/')));

app.use('/home', express.static(path.join(__dirname, '/')));
app.use('/home', express.static(path.join(__dirname, '/assets/images/')));
app.use('/uploadImages', express.static(path.join(__dirname, '/')));
app.use(cookieParser());

app.use(session({ secret: config.secretKey}));
app.use(passport.initialize());
app.use(passport.session())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', mainRouter);
app.use('/images', imageRouter);
app.use('/albums', albumRouter);
app.use('/followers', followerRouter);
app.use('/users', userRouter);
app.use('/upload', uploadRouter);

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
    res.json(err);
  });



module.exports = app;