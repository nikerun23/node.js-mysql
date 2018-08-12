var mysql = require("mysql");

var db = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: '',
  multipleStatements:false
});
db.connect();
module.exports = db;
