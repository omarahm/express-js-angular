/**
 *
 * @apiDefinePermission authenticated
 *
 */


module.exports = function(router, connection){
	
	/**
	 * @api {post} /items Insert a new item
	 * @apiName PostItem
	 * @apiGroup Items
	 * @apiVersion 0.1.0
	 * @apiPermission authenticated
	 *
	 * @apiParam {Integer} category_id  (required)The unique identifier for the containing category.
	 * @apiParam {String} name  (required)A name for the item
	 *
	 * @apiSuccess {Integer} id The id for the inserted entity
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *    {
	 *        "id": 1
	 *    }
	 *
	 * @apiError NoAccessRight Only authenticated users can access the data 
	 * @apiError RequiredDataMissing A required data is missing
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 500 Server error
	 *     {
	 *       "error": "RequiredDataMissing"
	 *     }
	 */
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
	/**
	 * @api {get} /items Return the collection of items
	 * @apiDescription Results optionally can be filtered with a category or a menu.
	 * @apiName GetItems
	 * @apiGroup Items
	 * @apiVersion 0.1.0
	 * @apiPermission authenticated
	 *
	 * @apiParam {Integer} menu_id  (optional)The unique identifier for a menu to filter the set with.
	 * @apiParam {Integer} category_id  (optional)The unique identifier for a category to filter the set with.
	 * @apiParam {Integer} include_sizes  (optional)Whether to include the full sizes array with each item or not. Boolean
	 *
	 * @apiSuccess {Integer} id Unique identifier for the item
	 * @apiSuccess {Integer} category_id The containing category unique identifier
	 * @apiSuccess {String} name  The item name
	 * @apiSuccess {Array} sizes  (If include_sizes was sent)An array of sizes attached to the item
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     [
	 *    {
	 *        "id": 1,
	 *        "category_id": 1,
	 *        "name": "Buffalo Wings",
	 *        "sizes": [
	 *            {
	 *                "size": "8 pieces",
	 *                "price": 10.5
	 *            },
	 *            {
	 *                "size": "12 pieces",
	 *                "price": 15
	 *            },
	 *            {
	 *                "size": "16 pieces",
	 *                "price": 17
	 *            },
	 *            {
	 *                "size": "20 pieces",
	 *                "price": 21
	 *            },
	 *            {
	 *                "size": "20 pieces",
	 *                "price": 21
	 *            }
	 *        ]
	 *    },
	 *    {
	 *        "id": 4,
	 *        "category_id": 2,
	 *        "name": "Margrita",
	 *        "sizes": [
	 *            {
	 *                "size": "small",
	 *                "price": 15
	 *            },
	 *            {
	 *                "size": "medium",
	 *                "price": 23
	 *            },
	 *            {
	 *                "size": "large",
	 *                "price": 35
	 *            }
	 *        ]
	 *    }
	 * ]
	 *
	 * @apiError NoAccessRight Only authenticated users can access the data 
	 * @apiError InvalidMenuId No menu was found with the supplied id
	 * @apiError InvalidCategoryId No category was found with the supplied id
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 401 Not Authenticated
	 *     {
	 *       "error": "NoAccessRight"
	 *     }
	 */ 
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
	/**
	 * @api {get} /items/:item_id Return the data of a single item
	 * @apiName GetItem
	 * @apiGroup Items
	 * @apiVersion 0.1.0
	 * @apiPermission authenticated
	 *
	 * @apiParam {Integer} item_id  The unique identifier for the item.
	 *
	 * @apiSuccess {Integer} id Unique identifier for the item
	 * @apiSuccess {Integer} category_id The containing category unique identifier
	 * @apiSuccess {String} name  The item name
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *    {
	 *        "id": 1,
	 *        "category_id": 1,
	 *        "name": "Buffalo Wings"
	 *    }
	 *
	 * @apiError NoAccessRight Only authenticated users can access the data 
	 * @apiError InvalidItemId No item was found with the supplied id
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 404 Not found
	 *     {
	 *       "error": "InvalidItemId"
	 *     }
	 */ 	
	router.route('/items/:item_id').get(function(req, res){
		var Item = require('../models/item.js');

		includeSizes = false;
		if(req.query.include_sizes) includeSizes = true;

		Item.findOne(connection, req.params.item_id, function(err, item){
			res.json(item);
		}, includeSizes);
	});
	/**
	 * @api {put} /items/:item_id Update the data for an existing item
	 * @apiName PutItem
	 * @apiGroup Items
	 * @apiVersion 0.1.0
	 * @apiPermission authenticated
	 *
	 * @apiParam {Integer} item_id  The unique identifier for the item.
	 *
	 * @apiSuccess {Integer} id The id for the updated entity
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *    {
	 *        "id": 1
	 *    }
	 *
	 * @apiError NoAccessRight Only authenticated users can access the data 
	 * @apiError InvalidItemId No item was found with the supplied id
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 404 Not found
	 *     {
	 *       "error": "InvalidItemId"
	 *     }
	 */
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
	/**
	 * @api {delete} /items/:item_id Delete an existing item
	 * @apiName DeleteItem
	 * @apiGroup Items
	 * @apiVersion 0.1.0
	 * @apiPermission authenticated
	 *
	 * @apiParam {Integer} item_id  The unique identifier for the item.
	 *
	 * @apiSuccess {Integer} id Unique identifier for the item
	 * @apiSuccess {String} name The item's name
	 * @apiSuccess {String} size  The size variant name
	 * @apiSuccess {decimal} price  The price for this variant
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 * [
	 *     {
 	 *         "id": "2",
 	 *         "name": "Buffalo Wings",
	 *         "size": "12 pieces",
	 *         "price": 15
	 *     },
	 *     {
	 *         "id": "3",
	 *         "name": "Buffalo Wings",
	 *         "size": "16 pieces",
	 *         "price": 17
	 *     },
	 *     {
	 *         "id": "1",
	 *         "name": "Buffalo Wings",
	 *         "size": "8 pieces",
	 *         "price": 10.5
	 *     }
	 * ]
	 *
	 * @apiError NoAccessRight Only authenticated users can access the data 
	 * @apiError InvalidItemId No item was found with the supplied id
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 404 Not found
	 *     {
	 *       "error": "InvalidItemId"
	 *     }
	 */
	router.route('/items/:item_id').delete(function(req, res){
		var Item = require('../models/item.js');
		var item = new Item(connection, req.params.item_id);

		item.delete(function(err, itemId){
			if(err) res.send(err); //TODO: don't send the raw database errors, a generic error message is better

			res.json('deleted'); 
		});
	});

	/**
	 * @api {post} /items/search Search and filter items using a  keyword
	 * @apiName SearchItem
	 * @apiGroup Items
	 * @apiVersion 0.1.0
	 * @apiPermission authenticated
	 *
	 * @apiParam {String} keyword  The keyword to filter the result by
	 *
	 * @apiSuccess {String} A status message
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *    {
	 *        "deleted"
	 *    }
	 *
	 * @apiError NoAccessRight Only authenticated users can access the data 
	 * @apiError InvalidItemId No item was found with the supplied id
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 404 Not found
	 *     {
	 *       "error": "InvalidItemId"
	 *     }
	 */
	router.route('/items/search').post(function(req, res){
		var Item = require('../models/item.js');

		searchKeyword = req.body.keyword;

		Item.search(connection, searchKeyword, function(err, items){
			if(err) res.json(err);
			res.json(items);
		});
	});
}