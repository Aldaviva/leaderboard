var personRepository = require('../lib/personRepository');

exports.index = function(req, res){
	personRepository.getAll()
		.then(function(people){
			res.render('index', { people: people });
		});
};