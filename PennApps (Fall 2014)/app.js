/**
 * Module dependencies.
 */

var express      = require('express')
  , path         = require('path')
  , favicon      = require('static-favicon')
  , logger       = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser');

/**
 * App.
 */

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('host', process.env.VCAP_APP_HOST || 'localhost');
app.set('port', process.env.VCAP_APP_PORT || 3000);

/**
 * Middleware.
 */

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes.
 */

var routes = require('./routes');
var error = require('./error');

routes(app);

app.use(error.invalidRoute);
app.use(
  app.get('env') === 'development' ? error.development() : error.production()
)

module.exports = app;

var http = require('http');

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});