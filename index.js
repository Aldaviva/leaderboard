var express  = require('express');
var http     = require('http');
var path     = require('path');
var config   = require('./config');
var logger   = console;
var database = require('./lib/database');
var helpers = require('express-helpers');

database.connect().done();
var app      = express();

var routes   = {};
routes.index = require('./routes');
routes.admin = require('./routes/admin');

// all environments
app.set('port', config.wwwPort || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
helpers(app);
// app.use(expressPartials());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

app.locals._ = require('lodash');

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get ('/',      routes.index.index);
app.get ('/admin', routes.admin.index);
app.post('/admin', routes.admin.save);

http.createServer(app).listen(app.get('port'), function(){
	logger.log('Listening on *:%d.', app.get('port'));
});
