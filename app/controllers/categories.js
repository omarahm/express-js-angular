module.exports = function(router, connection){
	
	router.route('/categories').post(function(req, res) {
		var Category = require('../models/category.js');
		var category = new Category(connection);

		//TODO: Validate req.body.name
		category.menu_id = req.body.menu_id;
		category.name    = req.body.name;

		category.save(function(err, categoryId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json({id: categoryId}); 
		});
	});
	router.route('/categories').get(function(req, res){
		var Category = require('../models/category.js');

		filters = {};
		if(req.query.menu_id) filters.menu_id = req.query.menu_id;
		
		Category.find(connection,function(err, categories){
			res.json(categories);
		}, filters);
	});
	router.route('/categories/:category_id').get(function(req, res){
		var Category = require('../models/category.js');

		Category.findOne(connection, req.params.category_id, function(err, category){
			res.json(category);
		});
	});
	router.route('/categories/:category_id').put(function(req, res){
		var Category = require('../models/category.js');
		var category = new Category(connection, req.params.category_id);

		//TODO: Validate req.body.name
		category.name = req.body.name;
		category.menu_id = req.body.menu_id;
		
		category.save(function(err, categoryId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json({id: categoryId}); 
		});
	});
	router.route('/categories/:category_id').delete(function(req, res){
		var Category = require('../models/category.js');
		var category = new Category(connection, req.params.category_id);

		category.delete(function(err, categoryId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json('deleted'); 
		});
	});
}