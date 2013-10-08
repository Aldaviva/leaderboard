var _  = require('lodash');
var db = require('../lib/database');
var Q  = require('q');

var peopleCollection = db.collection('people');

/*
 * TODO
 * If the database is empty, the admin interface won't have enough rows to populate.
 * When the application starts, make sure there are 5 people for each period. If not, create enough
 *  blank people (only 'period' field is required).
 */

var CATEGORY_ORDER = ['quarter', 'month', 'rep', 'sdr'];

exports.getAll = function(){
	var deferred = Q.defer();

	var cursor;
	peopleCollection.find({}, { sort: [['period', -1], ['quota', -1], ['leads', -1]] }, function(err, _cursor){
		cursor = _cursor;
		if(err) deferred.reject(err);

		cursor.toArray(function(err, people){
			if(err) deferred.reject(err);

			var groupedPeople = _(people).filter('name').groupBy('category').value();
			deferred.resolve(groupedPeople);
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