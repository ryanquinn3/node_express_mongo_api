var express = require('express');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');
var logger = require('morgan');
var passport = require('passport');
var jwt = require('jwt-simple');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./mongo_express_config');
var dotenv = require('dotenv');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
//Load environment variables from .env file, where API keys and passwords are configured.
dotenv.load({path: '.env'});

var config = require('./config/database');
//Database setup
mongoose.connect(config.mongoURI[app.settings.env]);

mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
mongoose.connection.on('open', function(){
  console.log('Connected to MongoDB');
})

app.set('port', process.env.PORT || 3000);
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

/**
* Mongo Express GUI
*/
app.use('/mongo_express', mongo_express(mongo_express_config))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
//app.use(errorHandler());
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render({
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
