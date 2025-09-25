const OracleDB = require("oracledb");
var connect = require("../../config/db");

class MinoutGroupLine {
  constructor(row) {
    this.row = row;
  }
  static async selectQuery(query) {
    try {
      const connection = await connect;
      const result = await connection.execute(query, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT });
      return result.rows;
    } catch (error) {
      console.error('error Existe' + error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }
  static async updateQuery(e) {
    try {
      const connection = await connect;
      const result = connection.execute(e);
      return result.rowsAffected;
    } catch (error) {
      console.error('Error occurred during update: ' + error);
      throw error; // Rethrow the error to be handled by the caller
    }
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

module.exports = MinoutGroupLine;
