var personRepository = require('../lib/personRepository');

exports.index = function(req, res){
	personRepository.getPeople()
		.then(function(people){
  			res.render('admin', { people: people });
  		});
};

exports.save = function(req, res){
	console.log(req.body);
	res.redirect('.');
};