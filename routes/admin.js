var personRepository = require('../lib/personRepository');
var Q                = require('q');
var server           = require('../index');

exports.index = function(req, res){
	personRepository.getAll()
		.then(function(categories){
  			res.render('admin', { categories: categories });
  		});
};

exports.save = function(req, res){
	var peopleToInsert = req.body.people.map(function(rawPerson){
		return {
			name     : rawPerson.name,
			category : rawPerson.category,
			office   : typeof rawPerson.office == 'undefined' ? null : rawPerson.office.toLowerCase(),
			acv      : typeof rawPerson.acv    == 'undefined' ? null : parseInt(rawPerson.acv) * 1000,
			quota    : typeof rawPerson.quota  == 'undefined' ? null : parseInt(rawPerson.quota) / 100,
			leads    : typeof rawPerson.leads  == 'undefined' ? null : parseInt(rawPerson.leads)
		};
	});

	personRepository
		.deleteAll()
		.then(function(){
			return Q.all(peopleToInsert.map(personRepository.create));
		})
		.then(function(){
			res.redirect('.?msg='+encodeURIComponent('Leaderboard updated successfully.'));
		})
		.done();

	server.io.sockets.emit('change:leaders');
};