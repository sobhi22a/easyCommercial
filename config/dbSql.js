var mysql  = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '123456',
  database : 'quotaattiryak',
  //insecureAuth : true,
  
  port : 3306
});
connection.connect();
module.exports = connection