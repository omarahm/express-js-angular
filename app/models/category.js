function Category(connection, categoryId){
	this.connection = connection;

	if(categoryId)
		this.categoryId = connection.escape(categoryId);
}
//Static methods
Category.find = function(connection, callback, filters){

	if(!filters || Object.keys(filters).length === 0)
		queryStr = 'SELECT * FROM categories';
	else{
		filtersStr = [];
		for(var i in filters){
			filtersStr.push(i+'='+connection.escape(filters[i])+'');
		}
		queryStr = 'SELECT * FROM categories WHERE '+filtersStr.join(' AND ');
	}

	connection.query(queryStr, function(err, result){
		if(err) callback(err);
		else{
			callback(undefined, result);
		}
	});
}
Category.findOne = function(connection, id, callback){
	Category.find(connection, function(err, categories){
		if(err) callback(err);
		else{
			category = categories[0];	
			callback(undefined, category);
		}
	}, {'id': id});
}
//Instance methods
Category.prototype.save = function(callback){

	self = this;

	//TODO: validate name

	if(!self.categoryId){ //INSERT a new record
		queryStr = 'INSERT INTO categories SET ?';
	}else{ //There's a categoryId, we should UPDATE the item
		queryStr = 'UPDATE categories SET ? WHERE id='+self.categoryId;
	}

	self.connection.query(queryStr,{menu_id: self.menu_id, name: self.name}, function(err, result){
		if(err) callback(err);
		else{
			if(!self.categoryId) self.categoryId = result.insertId;

			callback(undefined, self.categoryId);
		}
	});
}
Category.prototype.delete = function(callback){

	self = this;

	//TODO: validate name

	if(!self.categoryId) callback('new instances can\'t be deleted');
	else{
		queryStr = 'DELETE FROM categories WHERE id='+self.categoryId;

		self.connection.query(queryStr, function(err, result){
			if(err) callback(err);
			else{
				if(!self.categoryId) self.categoryId = result.insertId;

				callback(undefined, self.categoryId);
			}
		});
	}
}
module.exports = Category;