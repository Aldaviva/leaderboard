var config = require('../config');
var mongo  = require('mongodb');
var Q      = require('q');
var logger = console;

var dbOptions = {
	journal: true,
	numberOfRetries: Number.POSITIVE_INFINITY
};

var serverOptions = {
	auto_reconnect: true
};

var server = new mongo.Server(config.dbHost, config.dbPort, serverOptions);
server.allServerInstances().forEach(function(serverInstance){
	serverInstance.dbInstances = serverInstance.dbInstances || [];
});

var db = module.exports = new mongo.Db(config.dbName, server, dbOptions);

var dbPromise;

module.exports.connect = function(){
	return Q.ninvoke(db, "open")
		.then(onConnect)
		.then(function(db_){
			db_.ensureIndex('periods', { name: 1 }, {unique: true }, function(err){
				if(err){
					logger.error("Could not create index", err);
				}
			});
		})
		.fail(function(err){
			logger.error(err.message);
		});
};

module.exports.shutdown = function(){
	return dbPromise
		.then(function(){
			var deferred = Q.defer();
			db.close(deferred.makeNodeResolver());
			return deferred.promise;
		})
		.finally(function(){
			logger.log("Shut down.");
		});
};

function onConnect(db_){
	logger.info("Connected to %s:%d/%s.", db_.serverConfig.host, db_.serverConfig.port, db_.databaseName);
	return db_;
}