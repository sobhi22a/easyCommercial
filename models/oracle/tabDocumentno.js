const OracleDB = require("oracledb");
var connect = require("../../config/db");

class TabDocumentno {
  constructor(row) {
    this.row = row;
  }
  static select(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(`${e}`, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT })
          .then(function (result) {
            cb(result.rows);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static update(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(`${e}`)
          .then(function (result) {
            cb(result.rowsAffected);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static getDocumentno = () => {
    return new Promise((resolve)=>{
      try {
        connect.execute('BEGIN');
        connect.then((con) => {
          con.execute('select * from ad_user')
          .then((r) => { console.log(r) })
        })
        //console.log(result);
      } catch (error) {
        
      }
    })
  }

}

module.exports = TabDocumentno;
