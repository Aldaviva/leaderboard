var _  = require('lodash');
var db = require('../lib/database');

var peopleCollection = db.collection('people');

exports.index = function(req, res){
	peopleCollection.find({}, { sort: [['period', -1], ['quota', -1]] }, function(err, cursor){
		if(err) throw err;

		cursor.toArray(function(err, people){

			var ranks = {};

			_.forEach(people, function(person){
				if(!ranks[person.period]){
					ranks[person.period] = 0;
				}

				person.rank = ++ranks[person.period];
			});

			res.render('index', { people: people });
		});
	});
};