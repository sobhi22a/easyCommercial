var connect = require('../config/db')
const OracleDB = require("oracledb");

class tabM_product{
    constructor(row){
        this.row=row
    }
    static selectFeatures(e,cb){
        connect.then(function(conn) {
            return conn.execute(
                `${e}`,{},{outFormat: OracleDB.OUT_FORMAT_OBJECT}
            )
                .then(function(result){
                    cb(result.rows)
                })
                .catch(function(err) {
                    console.error(err);
                });
        })
            .catch(function(err) {
                console.error(err);
            });
    }

    static select(e,cb){
      connect.then(function(conn) {
          return conn.execute(
           ` select ${e.select} from m_product ${e.where} `
          )
          .then(function(result){
           cb(result.rows)
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
                ` ${sql} `
            )
                .then(function(result){
                    cb(result.rowsAffected);
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
module.exports=tabM_product