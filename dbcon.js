var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_clemeant',
  password        : '6488',
  database        : 'cs361_clemeant'
});

module.exports.pool = pool;
