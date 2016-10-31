var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb){
        var newname=file.originalname.split('.')
        var ext=newname[newname.length-1];
        cb(null, newname[0]+ '_' + Date.now()+'.'+ext)
    }
});
var upload = multer({ storage: storage }).array('files');
var routes = require('./routes/index');
var adminActions = require('./routes/adminActions');
var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/3aauctions').then(() => console.log('database connected')).catch((err) => console.error(err))
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('userBiddedonProperty', function(msg){
        socket.broadcast.emit('userBiddedonProperty', msg);
  });
})

server.listen(3000, function(){
  console.log('listening on *:3000');

});

//upload files
app.post('/upload', function (req, res, next) {
    upload(req, res, function(err){
        if(err) res.json('no images')
        res.json(req.files)
    })
})




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use(fileupload());

app.use('/', routes);
app.use('/adminActions', adminActions);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
