const OracleDB = require("oracledb");
var connect = require("../../config/db");

class M_Package {
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
}

module.exports = M_Package;
