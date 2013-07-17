var express  = require('express');
var http     = require('http');
var path     = require('path');
var config   = require('./config');
var logger   = console;
var database = require('./lib/database');
var helpers  = require('express-helpers');
var io       = require('socket.io');

database.connect().done();
var app      = express();

app.set('env', 'production');
app.set('port', config.wwwPort || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
helpers(app);
// app.use(expressPartials());
app.use(express.favicon());
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

app.locals._ = require('lodash');

if ('development' == app.get('env')) {
	console.log("express development mode");
	app.use(express.errorHandler());
}

var server = http.createServer(app);
server.io = io.listen(server, {
	'log level': 1, // 0 - error, 1 - warn, 2 - info, 3 - debug
	'transports': ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'],
	'browser client minification': true,
	'browser client etag': true,
	'browser client gzip': true
});
server.app = app;

module.exports = server;

server.listen(app.get('port'), function(){
	logger.log('Listening on *:%d.', app.get('port'));
});

var routes   = {};
routes.index = require('./routes');
routes.admin = require('./routes/admin');

app.get ('/',      routes.index.index);
app.get ('/admin', routes.admin.index);
app.post('/admin', routes.admin.save);