var personRepository = require('../lib/personRepository');
var Q                = require('q');
var server           = require('../index');

exports.index = function(req, res){
	personRepository.getAll()
		.then(function(people){
  			res.render('admin', { people: people });
  		});
};

exports.save = function(req, res){
	var peopleToInsert = req.body.people.map(function(rawPerson){
		return {
			name   : rawPerson.name,
			period : rawPerson.period,
			acv    : parseInt(rawPerson.acv) * 1000,
			quota  : parseInt(rawPerson.quota) / 100
		};
	});

	personRepository.deleteAll()
		.then(function(){
			return Q.all(peopleToInsert.map(personRepository.create));
		})
		.then(function(){
			res.redirect('.?msg='+encodeURIComponent('Leaderboard updated successfully.'));
		})
		.done();

	server.io.sockets.emit('change:leaders');
};