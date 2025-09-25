const connect = require("../../../config/dbSql");

class TabInventaireMysql {
  constructor(row) {
    this.row = row;
  }

  static insert(e) {
    return new Promise((resolve, reject) => {
      connect.query(
        "insert into inventaire set name=?,m_product_id=?,quantity=?,ppa=?,date=?,lot=?,empl=?,createdBy=?,createdAt=?",
        [e.name, e.m_product_id, e.quantity, e.ppa, e.date, e.lot, e.empl, e.createdBy, e.createdAt],
        (err, result) => {
          if (err) throw err.message;
          resolve(result);
        }
      );
    });
  }

  static selectProduitisFinished(e) {
    return new Promise((resolve, reject) => {
      connect.query(`select * from inventaireproduits where isFinished = '${e.isFinished}'`, (err, result) => {
        if (err) throw err.message;
        resolve(result);
      });
    });
  }

  static selectInventoryProductByDate(e) {
    const isFinished = e.isFinished != "" ? `where isFinished = "${e.isFinished}"` : "";
    return new Promise((resolve, reject) => {
      connect.query(
        `SELECT * 
                FROM (
                    SELECT *, DATE(createdAt) AS truncated_date
                    FROM inventaireproduits ${isFinished} order by userName, name
                ) subquery
                WHERE truncated_date = '${e.from}'`,
        (err, result) => {
          if (err) throw err.message;
          resolve(result);
        }
      );
    });
  }

  static selectInventoryProductByAdUser(e) {
    const isFinished = e.isFinished != "" ? `AND isFinished = "${e.isFinished}"` : "";
    return new Promise((resolve, reject) => {
      connect.query(
        `SELECT * 
                FROM (
                    SELECT *, DATE(createdAt) AS truncated_date
                    FROM inventaireproduits where ad_user_id = '${e.ad_user_id}' ${isFinished} order by name
                ) subquery
                WHERE truncated_date = '${e.from}'`,
        (err, result) => {
          if (err) throw err.message;
          resolve(result);
        }
      );
    });
  }

  static delete(e) {
    return new Promise((resole, reject) => {
      connect.query(`${e}`, (err, result) => {
        if (err) throw err.message;
        resole(result);
      });
    });
  }

  static update(e) {
    return new Promise((resole, reject) => {
      connect.query(`${e}`, (err, result) => {
        if (err) throw err.message;
        resole(result);
      });
    });
  }

  static select(e) {
    return new Promise((resolve, reject) => {
      try {
        connect.query(`${e}`, (err, result) => {
          if (err) throw err.message;
          resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = TabInventaireMysql;
