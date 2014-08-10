es = require('elasticsearch');
esClient = new es.Client({
  host: 'localhost:9200'
});
async = require('async');

function Item(connection, itemId){
	
	this.connection = connection;

	if(itemId)
		this.itemId = connection.escape(itemId);
}
//Static methods
Item.find = function(connection, callback, filters, includeSizes){

	//TODO: implement the feature to auto-include sizes
	if(!filters || Object.keys(filters).length === 0){
		queryStr = 'SELECT * FROM items';
	}
	else{
		if(filters.menu_id){
			queryStr = 'SELECT * FROM items WHERE category_id IN (SELECT id FROM categories WHERE menu_id = '+connection.escape(filters.menu_id)+')';
		}
		else{
			filtersStr = [];
			for(var i in filters){
				filtersStr.push(i+'='+connection.escape(filters[i])+'');
			}
			queryStr = 'SELECT * FROM items WHERE '+filtersStr.join(' AND ');
		}
	}

	connection.query(queryStr, function(err, result){
		if(err) callback(err);
		else{
			if(includeSizes){

				//We should implement the includeSizes flag to work as a table JOIN in the original query
				//This loop, even when done in parallel, is a performance penalty
				
				async.each(result, function(item, eachCallback){
					connection.query('SELECT size,price FROM items_sizes WHERE item_id = '+item.id, function(err, sizes){
						if(err) callback(err);
						else{
							item.sizes = sizes;
							eachCallback();
						}
					});
				},function(){
					callback(undefined, result);	
				})
			}
			else
				callback(undefined, result);
		}
	});
}
Item.findOne = function(connection, id, callback, includeSizes){
	Item.find(connection, function(err, items){
		if(err) callback(err);
		else{
			item = items[0];	
			callback(undefined, item);
		}
	}, {'id': id}, includeSizes);
};
Item.search = function(connection, searchKeyword, callback){
	console.log(searchKeyword);
	//if(searchKeyword != '') searchKeyword = '*'+searchKeyword+'*';
	esClient.search({
		'index': 'elmenus',
		//'q': '*'+searchKeyword+'*'
		'body': {
			'query': {
				'prefix': {'_all': searchKeyword}
			}
		}
	},function(err, response){
		if(err) callback(err);
		else{
			items = [];
			response.hits.hits.forEach(function(hit){
				items.push({
					id: hit._id,
					name: hit._source.item_name,
					size: hit._source.item_size_name,
					price: hit._source.item_price
				})
			});
			callback(undefined, items);
		}
	});
};
//Instance methods
Item.prototype.save = function(callback){

	self = this;

	//TODO: validate name

	if(!self.itemId){ //INSERT a new record
		queryStr = 'INSERT INTO items SET ?';
	}else{ //There's a itemId, we should UPDATE the item
		queryStr = 'UPDATE items SET ? WHERE id='+self.itemId;
	}
	
	updateFields = {};
	if(self.name) updateFields.name = self.name;
	if(self.category_id) updateFields.category_id = self.category_id;

	self.connection.query(queryStr,updateFields, function(err, result){
		if(err) callback(err);
		else{
			if(!self.itemId){//It was a new item, an INSERT operation
				self.itemId = result.insertId;
				callback(undefined, self.itemId);
			}
			else{ //It was an update operation, update es index
				//Get Item sizes
				//TODO: Use elasticsearch bulk operation instead looping
				//TODO: Escape the ID
				console.log(self.itemId);
				console.log(typeof self.itemId);
				self.connection.query('SELECT * FROM items_sizes WHERE item_id = '+self.itemId, function(err, result){
					
					if(!err){
						esBulkIndex = [];
							
						async.each(result, function(sizeVariation, eachCallback){

							//Parallelism can be a bitch, a temp array to hold the operation and document so we the order isn't missed up
							operationDocumentPair = [
								{index: {
										_index: 'elmenus', _type: 'itemSizeVariation', _id: sizeVariation.id
								}},{
									item_id: self.itemId,
									item_name: self.name,
									item_size_name: sizeVariation.size,
									item_price: sizeVariation.price
								}
							];

							esBulkIndex = esBulkIndex.concat(operationDocumentPair);
							eachCallback();
						},function(eachErr){
							if(eachErr) callback(eachErr);
							else{
								esClient.bulk({body: esBulkIndex, refresh: true},function(bulkError, bulkResp){
									if(bulkError) callback(bulkError);
									else{
										callback(undefined, self.itemId);
									}
								});
							}
						});
					}
				});
			}
		}
	});
}
Item.prototype.delete = function(callback){

	self = this;

	//TODO: validate name

	if(!self.itemId) callback('new instances can\'t be deleted');
	else{
		queryStr = 'DELETE FROM items WHERE id='+self.itemId;

		self.connection.query(queryStr, function(err, result){
			if(err)
				callback(err);
			else{
				//Removing item's variations entries from elasticsearch's index
				esClient.deleteByQuery({
				  index: 'elmenus',
				  body: {
				    query: {
				      term: { item_id: self.itemId }
				    }
				  },
				  refresh: true
				}, function (esDeleteError, response) {
					if(esDeleteError) callback(esDeleteError);
					else
						callback(undefined, "deleted");
				});	
			}
		});
	}
}
module.exports = Item;