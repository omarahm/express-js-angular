module.exports = function(router, connection){
	
	router.route('/item_sizes').post(function(req, res) {
		var ItemSize = require('../models/item_size.js');
		var itemSize = new ItemSize(connection);

		//TODO: Validate req.body.name
		itemSize.itemId = req.body.item_id;
		itemSize.sizeStr    = req.body.size;
		itemSize.price    = req.body.price;

		itemSize.save(function(err, itemSizeId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json({id: itemSizeId}); 
		});
	});
	router.route('/item_sizes').get(function(req, res){

		
		var ItemSize = require('../models/item_size.js');

		ItemSize.find(connection,function(err, itemsSizes){
			res.json(itemsSizes);
		}, req.query.item_id);
	});
	router.route('/item_sizes/:item_size_id').get(function(req, res){
		var Item = require('../models/item_size.js');

		Item.findOne(connection, req.params.item_size_id, function(err, item){
			res.json(item);
		});
	});
	router.route('/item_sizes/:item_size_id').put(function(req, res){
		var Item = require('../models/item_size.js');
		var item = new Item(connection, req.params.item_size_id);

		//TODO: Validate req.body.name
		item.name = req.body.name;
		item.menu_id = req.body.menu_id;
		
		item.save(function(err, itemId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json({id: itemId}); 
		});
	});
	router.route('/item_sizes/:item_size_id').delete(function(req, res){
		var ItemSize = require('../models/item_size.js');
		var itemSize = new ItemSize(connection, req.params.item_size_id);

		itemSize.delete(function(err, itemSizeId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json('deleted'); 
		});
	});
}