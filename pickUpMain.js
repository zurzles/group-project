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
  	
	mysql.pool.query('SELECT * FROM games', function(err, rows, fields){
    		if(err){
      			next(err);
      			return;
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
  
	mysql.pool.query('INSERT INTO games (sport_type, start_time, location) VALUES (?,?,?)', [req.query.sport, req.query.time, req.query.location], function(err, rows, fields){
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
  
	var queryString  = 'SELECT * FROM games WHERE sport_type=?';
	mysql.pool.query(queryString, [req.query.type], function(err, rows, fields){
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
