var express    = require('express'); 		// call express
var app        = express();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'elmenus',
  password : 'gR8CDzd5hKvo',
  database : 'elmenus'
});
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.use(bodyParser());

var router = express.Router(); 				// get an instance of the express Router

require('./app/controllers/menus.js')(router, connection);
require('./app/controllers/categories.js')(router, connection);
require('./app/controllers/items.js')(router, connection);
require('./app/controllers/item_sizes.js')(router, connection);

app.use('/api', router);

app.use(express.static(__dirname + '/public'));
// START THE API SERVER
// =============================================================================
app.listen(80);