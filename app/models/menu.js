function Menu(connection, menuId){
	this.connection = connection;

	if(menuId)
		this.menuId = connection.escape(menuId);
}
//Static methods
Menu.find = function(connection, callback, filters){

	if(!filters || filters == {})
		queryStr = 'SELECT * FROM menus';
	else
		queryStr = 'SELECT * FROM menus WHERE id = '+connection.escape(filters.id);

	connection.query(queryStr, function(err, result){
		if(err) callback(err);
		else{
			callback(undefined, result);
		}
	});
}
Menu.findOne = function(connection, id, callback){
	Menu.find(connection, function(err, menus){
		if(err) callback(err);
		else{
			menu = menus[0];	
			callback(undefined, menu);
		}
	}, {'id': id});
}
//Instance methods
Menu.prototype.save = function(callback){

	self = this;

	//TODO: validate name

	if(!self.menuId){ //INSERT a new record
		queryStr = 'INSERT INTO menus SET ?';
	}else{ //There's a menuId, we should UPDATE the item
		queryStr = 'UPDATE menus SET ? WHERE id='+self.menuId;
	}

	self.connection.query(queryStr,{name: self.name}, function(err, result){
		if(err) callback(err);
		else{
			if(!self.menuId) self.menuId = result.insertId;

			callback(undefined, self.menuId);
		}
	});
}
Menu.prototype.delete = function(callback){

	self = this;

	//TODO: validate name

	if(!self.menuId) callback('new instances can\'t be deleted');
	else{
		queryStr = 'DELETE FROM menus WHERE id='+self.menuId;

		self.connection.query(queryStr, function(err, result){
			if(err) callback(err);
			else{
				if(!self.menuId) self.menuId = result.insertId;

				callback(undefined, self.menuId);
			}
		});
	}
}
module.exports = Menu;