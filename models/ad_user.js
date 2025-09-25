var connect = require("../config/db");
const OracleDB = require("oracledb");

class tabAd_User {
  constructor(row) {
    this.row = row;
  }

  static findByName(e, cb) {
    var name = e.indice;
    connect
      .then(function (conn) {
        return conn
          .execute(
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            "select u.ad_user_id, u.ad_org_id, u.name,u.password,u.ad_user_id,u.value,u.sip ,bp.C_BPartner_ID" +
              " from ad_user u " +
              " inner join C_BPartner  bp " +
              " on bp.C_BPartner_ID=u.C_BPartner_ID " +
              " where u.name=:n AND u.isactive='Y' ",
            { n: name },
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
          )
          .then(function (result) {
            cb(result.rows);
            //console.log(result.rows);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static findByIndice(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            "select name from c_bpartner where c_bpartner_id =:id",
            { id: e }
          )
          .then(function (result) {
            cb(result.rows);
            //console.log(result.rows);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static findByValue(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute("select name from AD_User where value =:v", { v: e })
          .then(function (result) {
            cb(result.rows);
            // console.log(result.rows);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static findById(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute("select value from AD_User where AD_User_ID =:v", { v: e })
          .then(function (result) {
            cb(result.rows);
            // console.log(result.rows);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static findByControler(cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `SELECT adu.name,password_md5,adu.ad_user_id from ad_user adu 
              inner join AD_User_Roles ur on ur.ad_user_id=adu.ad_user_id
              inner join ad_role ar on ar.ad_role_id=ur.ad_role_id
              inner join AD_Process_Access apa on apa.AD_Role_ID=ur.AD_Role_ID
              inner join ad_process ap on ap.ad_process_id=apa.ad_process_id
              WHERE EntityType='FLTR'
              and adu.ISACTIVE='Y' 
              and adu.PASSWORD_MD5 is not null 
              and ur.ad_role_id not in (1001937,1001846,1001841,1001839,1001838,1001433,1000009,1000008,1000001,1000000,103,102,0)
          `
          // ,{},
          //   { outFormat: OracleDB.OUT_FORMAT_OBJECT }
          )
          .then(function (result) {
            cb(result.rows);
            // console.log(result.rows);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static findByRoles(cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `SELECT distinct adu.ad_user_id,ur.ad_role_id,ap.name,ap.AD_Process_ID from ad_user adu 
              inner join AD_User_Roles ur on ur.ad_user_id=adu.ad_user_id
              inner join ad_role ar on ar.ad_role_id=ur.ad_role_id
              inner join AD_Process_Access apa on apa.AD_Role_ID=ur.AD_Role_ID
              inner join ad_process ap on ap.ad_process_id=apa.ad_process_id
              WHERE EntityType='FLTR'
              and adu.ISACTIVE='Y' and adu.PASSWORD_MD5 is not null
              and ur.ad_role_id not in 
              (1001937,1001846,1001841,1001839,1001838,1001433,1000009,1000008,1000001,1000000,103,102,0)
              `,
            {},
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
          )
          .then(function (result) {
            cb(result.rows);
            // console.log(result.rows);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static select(sql, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
          ${sql}
          `,
            {},
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
          )
          .then(function (result) {
            cb(result.rows);
            // console.log(result.rows);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  static update(sql, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
          ${sql}
          `,
            {},
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
          )
          .then(function (result) {
            cb(result.rowsAffected);
            // console.log(result.rows);
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

module.exports = tabAd_User;
