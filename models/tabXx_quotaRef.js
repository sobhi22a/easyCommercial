const connect = require("../config/dbSql");

class tabXx_quotaRef {
  constructor(row) {
    this.row = row;
  }

  static featuresSelect(sql, cb) {
    connect.query(`${sql}`, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  }

  static selectPromise(sql) {
    return new Promise((resolve, reject) => {
      connect.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static featuresDelete(sql, cb) {
    connect.query(`${sql}`, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  }

  static featuresUpdate(sql, cb) {
    connect.query(`${sql}`, (err, result) => {
      if (err) throw err;
      cb(result.affectedRows);
    });
  }

  static featuresPromise(sql) {
    return new Promise((resolve, reject) => {
      connect.query(`${sql}`, (err, result) => {
        if (err) reject (err);
          resolve(result.affectedRows);
      });
    });
  }
  
  static selectOne(e, cb) {
    connect.query(
      `select ${e.select} from xx_quotaref ${e.where}`,
      (err, result) => {
        if (err) throw err;
        cb(result);
      }
    );
  }

  static select(e, cb) {
    let indice = e.indice;
    switch (indice) {
      case 2:
        connect.query(
          "select * from xx_quotaref where reference=? and dateCreation=? ",
          [e.reference, e.dateCreation],
          (err, result) => {
            if (err) throw err;
            cb(result);
          }
        );
        break;
      case 306:
        connect.query(
          "select * from xx_quotaref where c_pbartner_id=? and dateCreation=? and confirme=? and ad_org_id=? and exception=?",
          [
            e.c_pbartner_id,
            e.dateCreation,
            e.confirme,
            e.ad_org_id,
            e.exception,
          ],
          (err, result) => {
            if (err) throw err.message;
            cb(result);
          }
        );
        break;
      case 407:
        connect.query(
          "select DISTINCT(reference),nomTiers,traiter,confirme,c_pbartner_id,status from xx_quotaref where ad_user_id=? and dateCreation=? ",
          [e.ad_user_id, e.dateCreation],
          (err, result) => {
            if (err) throw err.message;
            cb(result);
          }
        );
        break;
      case 13060910:
        connect.query(
          "select distinct reference,nomTiers,status,createby,modifierDC,exception,dateTraiter from xx_quotaref where id_svc=? and traiter=? and confirme=? and dateCreation=? order by dateTraiter",
          [e.id_svc, e.traiter, e.confirme, e.dateCreation],
          (err, result) => {
            if (err) throw err.message;
            cb(result);
          }
        );
        break;
      case 1307:
        connect.query(
          `select distinct reference, nomTiers,createby,ad_org_id,
            DATE_FORMAT(dateCreation,'%Y-%m-%d') as dateCreation,timeCreation 
            from xx_quotaref where dateCreation=? and ad_org_id=? and confirme=? and traiter=?`,
          [e.dateCreation, e.ad_org_id, e.confirme, e.traiter],
          (err, result) => {
            if (err) throw err.message;
            cb(result);
          }
        );
        break;
    }
  }
  static insert(e, cb) {
    let indice = e.indice;
    let exception = 0;
    if (e.exception == 1) {
      exception = 1;
    }
    switch (indice) {
      case 1:
        connect.query(
          "select * from xx_quotaref where c_order_id=?",
          [e.c_order_id],
          (err, repo) => {
            if (err) {
              throw err.message;
            } else {
              if (repo.length == 1) {
                cb("existe");
              } else {
                connect.query(
                  "insert into xx_quotaref set c_pbartner_id=?,documentno=?, " +
                    " c_order_id=?,dateCreation=?,timeCreation=?,createby=?,ad_user_id=?,nomTiers=?,ad_org_id=?,exception=?,id_svc=?,statusCmd=?",
                  [
                    e.c_bpartner_id,
                    e.documentno,
                    e.c_order_id,
                    e.dateCreation,
                    e.timeCreation,
                    e.createby,
                    e.ad_user_id,
                    e.nomTiers,
                    e.ad_org_id,
                    exception,
                    e.id_svc,
                    e.docStatus,
                  ],
                  (err, result) => {
                    if (err) throw err;
                    cb(result);
                  }
                );
              }
            }
          }
        );
        break;
      case 2:
        connect.query(
          "select * from xx_quotaref where c_order_id=?",
          [e.c_order_id],
          (err, repo) => {
            if (err) {
              throw err.message;
            } else {
              if (repo.length == 1) {
                cb("existe");
              } else {
                connect.query(
                  "insert into xx_quotaref set c_pbartner_id=?,documentno=?,c_order_id=?,dateCreation=?,timeCreation=?,createby=?,ad_user_id=?,nomTiers=?,ad_org_id=?,reference=?,exception=?,id_svc=?",
                  [
                    e.c_bpartner_id,
                    e.documentno,
                    e.c_order_id,
                    e.dateCreation,
                    e.timeCreation,
                    e.createby,
                    e.ad_user_id,
                    e.nomTiers,
                    e.ad_org_id,
                    e.reference,
                    e.exception,
                    e.id_svc,
                  ],
                  (err, result) => {
                    if (err) throw err;
                    cb(result);
                  }
                );
              }
            }
          }
        );
        break;
    }
  }

  static update(e, cb) {
    let indice = e.indice;
    switch (indice) {
      case 306:
        connect.query(
          "update xx_quotaref set reference=? where c_pbartner_id=? and dateCreation=? and reference=? and ad_org_id=? AND ad_user_id=?",
          [
            e.reference,
            e.c_pbartner_id,
            e.dateCreation,
            e.referenceWhere,
            e.ad_org_id,
            e.id_user,
          ],
          (err, affecred) => {
            if (err) throw err;
            cb(affecred.affectedRows);
          }
        );
        break;
      case 2:
        connect.query(
          "update xx_quotaref set traiter=?,dateTraiter=?,isCondition=?,status='N' where reference=? and confirme=?",
          [e.traiter, e.dateTraiter, e.isCondition, e.reference, e.confirme],
          (err, affecred) => {
            if (err) throw err.message;
            cb(affecred.affectedRows);
          }
        );
        break;
      case 10:
        connect.query(
          "update xx_quotaref set confirme=?,dateConfirme=? where reference=? and traiter=?",
          [e.confirme, e.dateConfirme, e.reference, e.traiter],
          (err, affecred) => {
            if (err) throw err.message;
            cb(affecred.affectedRows);
          }
        );
        break;
      case 210:
        connect.query(
          "update xx_quotaref set traiter=? where reference=? and confirme=?",
          [e.traiter, e.reference, e.confirme],
          (err, affecred) => {
            if (err) throw err.message;
            cb(affecred.affectedRows);
          }
        );
        break;
      case 22:
        connect.query(
          "update xx_quotaref set status=? where reference=?",
          [e.status, e.reference],
          (err, affecred) => {
            if (err) throw err.message;
            cb(affecred.affectedRows);
          }
        );
        break;
      case 17:
        connect.query(
          "update xx_quotaref set modifierDC=? where reference=?",
          [e.modifierDC, e.reference],
          (err, affecred) => {
            if (err) throw err.message;
            cb(affecred.affectedRows);
          }
        );
        break;
    }
  }

  static delete(e, cb) {
    let indice = e.indice;
    switch (indice) {
      case 110:
        connect.query(
          "delete from xx_quotaref where idBccQuota=? and confirme=? and traiter=?",
          [e.idBccQuota, e.confirme, e.traiter],
          (err, affecred) => {
            if (err) throw err.message;
            cb(affecred.affectedRows);
          }
        );
        break;
    }
  }
}

module.exports = tabXx_quotaRef;
