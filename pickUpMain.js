var express = require('express');
var mysql = require('./dbcon.js');
const bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.get('/',function(req,res,next){
  var context = {};
  var createString = "CREATE TABLE diagnostic(" +
  "id INT PRIMARY KEY AUTO_INCREMENT," +
  "text VARCHAR(255) NOT NULL)";
  mysql.pool.query('DROP TABLE IF EXISTS diagnostic', function(err){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query(createString, function(err){
      if(err){
        next(err);
		return;
      }
	  mysql.pool.query('INSERT INTO diagnostic (`text`) VALUES ("MySQL is Working!")',function(err){
	    mysql.pool.query('SELECT * FROM diagnostic', function(err, rows, fields){
		  context.results = JSON.stringify(rows);
		  res.render('home',context);
		});
	  });
    });
  });
});

app.get('/games',function(req,res,next){
	var context = {};
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
	//var queryString = 'SELECT * FROM games';
	var queryString = "SELECT game_id AS `Game ID`, sport_type AS `Sport`, start_date AS `Start Date`, " +
			"start_time AS `Start Time`, (SELECT user_name FROM users WHERE user_id = host_user) AS Host, " +
			"max_players AS `Max Players`, current_players AS `Current Players`, location_name AS `Location Name`, " +
			"location_address AS `Location Street Address`, location_city AS `City`, location_state AS `State`, " +
			"location_zip AS `Zip Code`, location_lat AS `Latitude`, location_long AS `Longitude` FROM games";	
	mysql.pool.query(queryString, function(err, rows, fields){
    		if(err){
      			next(err);
      			return;
    		}
		for(var i = 0; i < rows.length; i++){
			rows[i]["Start Date"] = rows[i]["Start Date"].toISOString().slice(0,10);
		}
		//context.results = JSON.stringify(rows);
		res.send(rows);
	});
});

app.get('/game_insert',function(req,res,next){
	var context = {};
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
	mysql.pool.query('INSERT INTO games (sport_type, start_date, start_time, host_user, max_players, location_name, location_address, location_city, location_state, location_zip) VALUES (?,?,?,?,?,?,?,?,?,?)', [req.query.sport, req.query.date, req.query.time, req.query.host_user, req.query.playercap, req.query.game_location, req.query.street, req.query.city, req.query.stateabbr, req.query.zipcode], function(err, rows, fields){
    		if(err){
      			console.log(err);
      			return;
    		}
		res.send(rows);
	});
});


app.get('/game_type',function(req,res,next){
	var context = {};
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
	var queryString = "SELECT sport_type FROM games";	
	mysql.pool.query(queryString, function(err, rows, fields){
		if(err){
			console.log(err);
		}
		res.send(rows)
	});
});

app.get('/games_by_type',function(req,res,next){
	var context = {};
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
	//var queryString  = 'SELECT * FROM games WHERE sport_type=?';
	var queryString = "SELECT game_id AS `Game ID`, sport_type AS `Sport`, start_date AS `Start Date`, " +
			"start_time AS `Start Time`, (SELECT user_name FROM users WHERE user_id = host_user) AS Host, " +
			"max_players AS `Max Players`, current_players AS `Current Players`, location_name AS `Location Name`, " +
			"location_address AS `Location Street Address`, location_city AS `City`, location_state AS `State`, " +
			"location_zip AS `Zip Code`, location_lat AS `Latitude`, location_long AS `Longitude` FROM games WHERE sport_type = ?";	
	mysql.pool.query(queryString, [req.query.type], function(err, rows, fields){
		if(err){
			console.log(err);
		}	
		for(var i = 0; i < rows.length; i++){
			rows[i]["Start Date"] = rows[i]["Start Date"].toISOString().slice(0,10);
		}
		res.send(rows)
	});
});


app.get('/user_info',function(req,res,next){
        var context = {};
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        //var queryString = "SELECT user_id FROM users";
        var queryString = "SELECT user_id, user_name FROM users";
        mysql.pool.query(queryString, function(err, rows, fields){
                if(err){
                        console.log(err);
                }
                res.send(rows)
        });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
