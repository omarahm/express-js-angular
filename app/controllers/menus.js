module.exports = function(router, connection){
	
	router.route('/menus').post(function(req, res) {
		var Menu = require('../models/menu.js');
		var menu = new Menu(connection);

		//TODO: Validate req.body.name
		menu.name = req.body.name;
		menu.save(function(err, menuId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json({id: menuId}); 
		});
	});
	router.route('/menus').get(function(req, res){
		var Menu = require('../models/menu.js');

		Menu.find(connection,function(err, menus){
			res.json(menus);
		});
	});
	router.route('/menus/:menu_id').get(function(req, res){
		var Menu = require('../models/menu.js');

		Menu.findOne(connection, req.params.menu_id, function(err, menu){
			res.json(menu);
		});
	});
	router.route('/menus/:menu_id').put(function(req, res){
		var Menu = require('../models/menu.js');
		var menu = new Menu(connection, req.params.menu_id);

		//TODO: Validate req.body.name
		menu.name = req.body.name;
		menu.save(function(err, menuId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json({id: menuId}); 
		});
	});
	router.route('/menus/:menu_id').delete(function(req, res){
		var Menu = require('../models/menu.js');
		var menu = new Menu(connection, req.params.menu_id);

		menu.delete(function(err, menuId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json('deleted'); 
		});
	});
}