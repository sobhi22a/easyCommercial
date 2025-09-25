const OracleDB = require('oracledb');
var connect = require('../../config/db')

class Articles{
    constructor(row){
        this.row=row
    }
    static select(sql,cb){
        connect.then(function(conn) {
            return conn.execute(
              ` ${sql} `,{},{outFormat: OracleDB.OUT_FORMAT_OBJECT}
              )
            .then(function(result) {
             cb(result.rows)
             //console.log(result.rows);
           })
           .catch(function(err) {
            console.error(err);
          });
        })
         .catch(function(err) {
           console.error(err);
       });
    }
    static update(sql,cb){
        connect.then(function(conn) {
            return conn.execute(
              ` ${sql} `,{},{outFormat: OracleDB.OUT_FORMAT_OBJECT}
              )
            .then(function(result) {
             cb(result.rowsAffected)
             //console.log(result.rows);
           })
           .catch(function(err) {
            console.error(err);
          });
        })
         .catch(function(err) {
           console.error(err);
       });
    }
}

module.exports=Articles