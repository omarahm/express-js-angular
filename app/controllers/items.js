module.exports = function(router, connection){
	
	router.route('/items').post(function(req, res) {
		var Item = require('../models/item.js');
		var item = new Item(connection);

		//TODO: Validate req.body.name
		item.category_id = req.body.category_id;
		item.name    = req.body.name;

		item.save(function(err, itemId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json({id: itemId}); 
		});
	});
	router.route('/items').get(function(req, res){
		var Item = require('../models/item.js');

		filters = {};
		if(req.query.menu_id) filters.menu_id = req.query.menu_id;
		if(req.query.category_id) filters.category_id = req.query.category_id;
		
		includeSizes = false;
		if(req.query.include_sizes) includeSizes = true;

		Item.find(connection,function(err, items){
			res.json(items);
		}, filters, includeSizes);
	});
	router.route('/items/:item_id').get(function(req, res){
		var Item = require('../models/item.js');

		includeSizes = false;
		if(req.query.include_sizes) includeSizes = true;

		Item.findOne(connection, req.params.item_id, function(err, item){
			res.json(item);
		}, includeSizes);
	});
	router.route('/items/:item_id').put(function(req, res){
		var Item = require('../models/item.js');
		var item = new Item(connection, req.params.item_id);

		//TODO: Validate req.body.name
		item.name = req.body.name;
		item.category_id = req.body.category_id;
		
		item.save(function(err, itemId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json({id: itemId}); 
		});
	});
	router.route('/items/:item_id').delete(function(req, res){
		var Item = require('../models/item.js');
		var item = new Item(connection, req.params.item_id);

		item.delete(function(err, itemId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json('deleted'); 
		});
	});

	router.route('/items/search').post(function(req, res){
		var Item = require('../models/item.js');

		searchKeyword = req.body.keyword;

		Item.search(connection, searchKeyword, function(err, items){
			if(err) res.json(err);
			res.json(items);
		});
	});
}