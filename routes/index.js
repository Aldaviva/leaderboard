var personRepository = require('../lib/personRepository');

exports.index = function(req, res){
	personRepository.getAll()
		.then(function(categories){
			res.render('index', { categories: categories });
		});
};