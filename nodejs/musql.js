var mysql = require('mysql');
var connection = mysql.createConnection({
  host      :'localhost',
  user      :'root',
  password  :'wlsldjtm23',
  databese  :'opentutorials'
});

connection.connect();



connection.end();
