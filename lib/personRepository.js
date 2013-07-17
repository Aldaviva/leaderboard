var _  = require('lodash');
var db = require('../lib/database');
var Q  = require('q');

var peopleCollection = db.collection('people');

exports.getAll = function(){
	var deferred = Q.defer();

	var cursor;
	peopleCollection.find({}, { sort: [['period', -1], ['quota', -1]] }, function(err, _cursor){
		cursor = _cursor;
		if(err) deferred.reject(err);

		cursor.toArray(function(err, people){
			if(err) deferred.reject(err);

			var ranks = {};

			_.forEach(people, function(person){
				if(!ranks[person.period]){
					ranks[person.period] = 0;
				}

				person.rank = ++ranks[person.period];
			});

			deferred.resolve(people);

			cursor.close();
		});
	});

	deferred.promise.finally(function(){
		cursor && cursor.close();
	});

	return deferred.promise;
};

exports.deleteAll = function(){
	return Q.ninvoke(peopleCollection, 'remove');
};

exports.create = function(person){
	return Q.ninvoke(peopleCollection, 'insert', person);
};