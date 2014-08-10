es = require('elasticsearch');
esClient = new es.Client({
  host: 'localhost:9200'
});

function ItemSize(connection, itemSizeId){
	
	this.connection = connection;

	if(itemSizeId)
		this.itemSizeId = itemSizeId;//connection.escape(itemSizeId);
}
//Static methods
ItemSize.find = function(connection, callback, itemId){

	if(itemId) 
		queryStr = 'SELECT * FROM items_sizes WHERE item_id = '+itemId;
	else
		queryStr = 'SELECT * FROM items_sizes';

	connection.query(queryStr, function(err, result){

		if(err)callback(err);
		else{
			callback(undefined, result);
		}
	});
}
ItemSize.findOne = function(connection, id, callback){

	connection.query('SELECT * FROM items_sizes WHERE id = '+id, function(err, result){
		if(err) callback(err);
		else{
			callback(undefined, result);
		}
	});
};
//Instance methods
ItemSize.prototype.save = function(callback){

	self = this;

	//TODO: validate name

	if(!self.ItemSizeId){ //INSERT a new record
		queryStr = 'INSERT INTO items_sizes SET ?';
	}else{ //There's a itemId, we should UPDATE the item
		queryStr = 'UPDATE items_sizes SET ? WHERE id='+self.ItemSizeId;
	}
	
	updateFields = {};
	if(self.itemId) updateFields.item_id = self.itemId;
	if(self.sizeStr) updateFields.size = self.sizeStr;
	if(self.price) updateFields.price = self.price;

	self.connection.query(queryStr,updateFields, function(err, result){
		if(err) callback(err);
		else{
			if(!self.itemSizeId){//It was a new item, an INSERT operation
				self.itemSizeId = result.insertId;
			}
			self.connection.query('SELECT * FROM items JOIN items_sizes ON items_sizes.item_id = items.id  WHERE items.id = '+self.itemId+' AND items_sizes.id = '+ self.itemSizeId, function(extendedDataErr, extendedData){
				
				if(extendedDataErr) callback(extendedDataErr);
				else{
					row = extendedData[0];

					esClient.index({
						index: 'elmenus',
						type: 'itemSizeVariation',
						id: self.itemSizeId,
						body: {
							item_id: self.itemId,
							item_name: row.name,
							item_size_name: row.size,
							item_price: row.price
						},
						refresh: true
					}, function(err, result){
						console.log(result);
						if(err) callback(err);
						else{
							callback(undefined, self.itemSizeId);
						}
					});
				}
			});
		}
	});
}
ItemSize.prototype.delete = function(callback){

	self = this;

	//TODO: validate name
	if(!self.itemSizeId) callback('new instances can\'t be deleted');
	else{
		queryStr = 'DELETE FROM items_sizes WHERE id='+self.itemSizeId;

		self.connection.query(queryStr, function(err, result){
			if(err)
				callback(err);
			else{
				console.log(self.itemSizeId);
				console.log(typeof self.itemSizeId);
				esClient.delete({
					index: 'elmenus',
					type: 'itemSizeVariation',
					id: self.itemSizeId
				}, function(err, result){
					if(err) callback(err);
					else{
						callback(undefined, "deleted");
					}
				});
			}
		});
	}
}
module.exports = ItemSize;