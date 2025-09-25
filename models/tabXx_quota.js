const OracleDB = require("oracledb");
var connect = require("../config/db");

class tabXx_quota {
  constructor(row) {
    this.row = row;
  }
  static selectAll(sql, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(` ${sql} `, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT })
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

  static selectFeature(sql) {
   return new Promise((resolve, reject) => {
     connect
      .then(function (conn) {
        return conn
          .execute(` ${sql} `, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT })
          .then(function (result) {
            resolve(result.rows);
            //console.log(result.rows);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
   })
  }
  static featureUpdate(sql, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(` ${sql} `)
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
  static selectAllTable(sql, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(` ${sql} `)
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
  static updateAll(sql, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(` ${sql} `, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT })
          .then(function (result) {
            cb(result.rowsAffected);
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

  static select(e, cb) {
    let indice = e.indice;
    switch (indice) {
      case 12:
        connect
          .then(function (conn) {
            return conn
              .execute(
                " SELECT q.m_product_id,pr.name,q.qtyallocated,q.quantity,q.xx_quota_id,q.c_bpartner_id,q.qtyordered,q.color " +
                  " from xx_quota q " +
                  " inner join m_product pr on q.m_product_id=pr.m_product_id " +
                  " inner join AD_User adu on adu.AD_User_ID=q.createdby " +
                  " where q.reference=:reference order by q.color,pr.name",
                { reference: e.reference },
                { outFormat: OracleDB.OUT_FORMAT_OBJECT }
              )
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
        break;
      case 122:
        connect
          .then(function (conn) {
            return conn
              .execute(
                " SELECT q.m_product_id,pr.name,q.qtyallocated,q.quantity,q.xx_quota_id,q.c_bpartner_id,q.qtyordered,q.color " +
                  " from xx_quota q " +
                  " inner join m_product pr " +
                  " on q.m_product_id=pr.m_product_id " +
                  " inner join AD_User adu  " +
                  " on adu.AD_User_ID=q.createdby " +
                  " where q.reference=:reference order by q.xx_quota_id DESC ",
                { reference: e.reference },
                { outFormat: OracleDB.OUT_FORMAT_OBJECT }
              )
              .then(function (result) {
                cb(result.rows);
                //console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
      case 912:
        connect
          .then(function (conn) {
            return conn
              .execute(
                " SELECT q.m_product_id,pr.name,q.qtyallocated,q.quantity from xx_quota q " +
                  " inner join m_product pr " +
                  " on q.m_product_id=pr.m_product_id " +
                  " inner join AD_User adu  " +
                  " on adu.AD_User_ID=q.createdby " +
                  " where reference=:reference and q.m_product_id=:m_product_id",
                { reference: e.reference, m_product_id: e.m_product_id }
              )
              .then(function (result) {
                cb(result.rows);
                //console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
      case 8:
        connect
          .then(function (conn) {
            return conn
              .execute(
                " select q.xx_quota_id,mp.name,q.qtyallocated,q.m_product_id,q.quantity,q.updatedby,q.reference from xx_quota q " +
                  " inner join m_product mp " +
                  " on q.m_product_id=mp.m_product_id " +
                  " where q.xx_quota_id=:xx_quota_id ",
                { xx_quota_id: e.xx_quota_id }
              )
              .then(function (result) {
                cb(result.rows);
                //console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
      case 1:
        connect
          .then(function (conn) {
            return conn
              .execute(
                " select q.reference,adu.name,p.name,bp.name,q.qtyallocated,q.xx_quota_id " +
                  " from xx_quota q " +
                  " inner join m_product p " +
                  " on q.m_product_id=p.m_product_id " +
                  " inner join ad_user adu " +
                  " on q.createdby =adu.ad_user_id " +
                  " inner join c_bpartner bp " +
                  " on q.c_bpartner_id=bp.c_bpartner_id " +
                  " where q.ad_org_id =:ad_org_id and q.createdby<>:id_dc and q.reference<>:reference and q.quantity=0" +
                  " and q.updatedby =:updatedby order by p.name ",
                {
                  ad_org_id: e.ad_org_id,
                  id_dc: e.ad_user_id,
                  updatedby: e.updatedby,
                  reference: e.reference,
                }
              )
              .then(function (result) {
                cb(result.rows);
                //console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
      case 111:
        connect
          .then(function (conn) {
            return conn
              .execute(
                ` select q.xx_quota_id,mp.name,q.quantity,q.QTYENTERED,q.QTYORDERED,q.DESCRIPTION,sc.RATING from xx_quota q
              INNER join m_product mp on q.M_PRODUCT_ID=mp.M_PRODUCT_ID
              inner join XX_SalesContext sc on sc.XX_SalesContext_ID=mp.XX_SalesContext_ID
              where q.createdby=${e.id_dc} AND q.AD_ORG_ID=${e.ad_org_id} 
              order by q.quantity desc `
              )
              .then(function (result) {
                cb(result.rows);
                //console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
      case 11122:
        connect
          .then(function (conn) {
            return conn
              .execute(
                "select q.xx_quota_id,mp.name,q.quantity,q.QTYENTERED,q.QTYORDERED,qtyallocated " +
                  "from xx_quota q " +
                  "INNER join m_product mp " +
                  "on q.M_PRODUCT_ID=mp.M_PRODUCT_ID " +
                  "where q.createdby=:ad_user_id AND q.AD_ORG_ID=:ad_org_id order by q.quantity desc ",
                {
                  ad_user_id: e.id_dc,
                  ad_org_id: e.ad_org_id,
                }
              )
              .then(function (result) {
                cb(result.rows);
                //console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
      case 20:
        connect
          .then(function (conn) {
            return conn
              .execute(
                `select q.ad_org_id,adu.name,q.createdby ,p.name,q.created,q.quantity,q.QTYALLOCATED
              from  xx_quota q 
              inner join ad_user adu on adu.AD_USER_ID=q.createdby 
              inner join m_product p on p.M_PRODUCT_ID=q.M_PRODUCT_ID
              where q.qtyentered=${e.exception} and q.CREATED>='${e.created}' and q.createdby  not in(1032294) `
              )
              .then(function (result) {
                cb(result.rows);
                //console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
    }
  }

  static findProduitDC(e, cb) {
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

  static findProduitExcel(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            " SELECT q.m_product_id,pr.name,q.quantity from xx_quota q " +
              " inner join m_product pr " +
              " on q.m_product_id=pr.m_product_id " +
              " inner join AD_User adu  " +
              " on adu.AD_User_ID=q.createdby  " +
              " where (q.createdby=:id_dc and q.ad_org_id=:ad_org_id and q.quantity>20) " +
              " OR (q.createdby =:id_svc and q.quantity>20) order by q.quantity desc",
            {
              id_dc: e.id_dc,
              ad_org_id: e.ad_org_id,
              id_svc: e.id_svc,
            },
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
          )
          .then(function (result) {
            //  console.log(result.rows)
            cb(result.rows);
            //console.log(result.rowsAffected);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static findProduitAdmin(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            " SELECT q.m_product_id,pr.name,q.qtyordered from xx_quota q " +
              " inner join m_product pr " +
              " on q.m_product_id=pr.m_product_id " +
              " inner join AD_User adu  " +
              " on adu.AD_User_ID=q.createdby " +
              " where adu.AD_User_ID=:id_dc ",
            { id_dc: e }
          )
          .then(function (result) {
            cb(result.rows);
            //console.log(result.rowsAffected);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static insert(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            "insert into xx_quota (ad_org_id,ad_client_id,m_product_id,ad_user_id,quantity,PERCENTAGE,QTYORDERED,qtyentered,reference,C_BPartner_ID,QTYALLOCATED,xx_quota_id,createdby,color,isCondition) " +
              " values " +
              " (:ad_org_id,1000000,:m_product_id,:ad_user_id,0,0,0,:exception,:reference,:C_BPartner_ID,:QTYALLOCATED,AD_SEQUENCE_NEXTNO('XX_Quota'),:createdby,:color,:isCondition)",
            {
              ad_org_id: e.ad_org_id,
              m_product_id: e.m_product_id,
              ad_user_id: null,
              reference: e.reference,
              C_BPartner_ID: e.c_bpartner_id,
              QTYALLOCATED: e.qtyallocated,
              exception: e.exception,
              createdby: e.ad_user_id,
              color: e.color,
              isCondition: e.isCondition,
            }
          )
          .then(function (result) {
            cb(result.rowsAffected);
            //console.log(result.rowsAffected);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static insert11(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            "insert into xx_quota (ad_org_id,ad_client_id,m_product_id,ad_user_id,quantity,PERCENTAGE,QTYORDERED,qtyentered,reference,C_BPartner_ID,QTYALLOCATED,xx_quota_id,createdby) " +
              " values " +
              " (:ad_org_id,1000000,:m_product_id,:ad_user_id,:quantity,0,0,:exception,:reference,:C_BPartner_ID,:QTYALLOCATED,AD_SEQUENCE_NEXTNO('XX_Quota'),:createdby)",
            {
              ad_org_id: e.ad_org_id,
              m_product_id: e.m_product_id,
              ad_user_id: null,
              quantity: e.quantity,
              reference: e.reference,
              C_BPartner_ID: e.c_bpartner_id,
              QTYALLOCATED: e.qtyallocated,
              exception: e.exception,
              //xx_quota_id: e.xx_quota_id,
              createdby: e.createdby,
            }
          )
          .then(function (result) {
            cb(result.rowsAffected);
            //console.log(result.rowsAffected);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  //modifier qtyOrdered par oper DC
  static updateAndInsert(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            " update xx_quota set qtyordered=qtyordered-:qts ,qtyallocated=qtyallocated+:qts ,updatedby=:adu " +
              " where createdby=:adu and m_product_id=:mp and qtyordered-:qts>=0 and ad_org_id=:ad_org_id",
            {
              qts: e.qts,
              adu: e.id_dc,
              mp: e.m_product_id,
              ad_org_id: e.ad_org_id,
            }
          )
          .then(function (result) {
            cb(result.rowsAffected);
            // console.log(result.rowsAffected);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  //modification sur qtyOrdered xx_arrivage
  static updateArrivage(e, cb) {
    let indice = e.indice;
    switch (indice) {
      case 8:
        connect
          .then(function (conn) {
            return conn
              .execute(
                " update xx_quota set qtyordered=:qtyordered " +
                  " where xx_quota_id=:xx_quota_id ",
                { qtyordered: e.qtyordered, xx_quota_id: e.xx_quota_id }
              )
              .then(function (result) {
                cb(result.rowsAffected);
                // console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
    }
  }
  //modification sur les ligne de opérateur
  static update(e, cb) {
    let indice = e.indice;
    switch (indice) {
      case 912:
        connect
          .then(function (conn) {
            return conn
              .execute(
                " update xx_quota set qtyallocated=:qtyallocated " +
                  " where reference=:reference and m_product_id=:m_product_id ",
                {
                  reference: e.reference,
                  m_product_id: e.m_product_id,
                  qtyallocated: e.qtyallocated,
                }
              )
              .then(function (result) {
                cb(result.rowsAffected);
                // console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
      case 8:
        connect
          .then(function (conn) {
            return conn
              .execute(
                " update xx_quota set quantity=:qtyordered,updatedby=:updatedby " +
                  " where xx_quota_id=:xx_quota_id ",
                {
                  xx_quota_id: e.xx_quota_id,
                  qtyordered: e.qtyordered,
                  updatedby: e.updatedby,
                }
              )
              .then(function (result) {
                cb(result.rowsAffected);
                // console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
      case 17:
        // and m_product_id not in (select m_product_id from m_product where m_product.ISPSYCHOTROPE='Y')
        connect
          .then(function (conn) {
            return conn
              .execute(
                " update xx_quota set quantity=qtyallocated,updatedby=:updatedby " +
                  " where reference=:reference and updatedby=:v ",
                { reference: e.reference, updatedby: e.updatedby, v: e.v }
              )
              .then(function (result) {
                cb(result.rowsAffected);
                // console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
    }
  }

  static featureDelete(sql) {
    return connect.then((conn) => {
      return conn.execute(`${sql}`)
        .then((result) => { return result.rowsAffected; })
        .catch((err) => {
          console.error(err);
          throw err; // Rethrow the error to be caught by the outer catch block
        });
    })
    .catch((err) => {
      console.error(err);
      throw err; // Rethrow the error to be caught by the caller
    });
  }
  static delete(e, cb) {
    let indice = e.indice;
    switch (indice) {
      case 912:
        connect
          .then(function (conn) {
            return conn
              .execute(
                " delete from xx_quota " +
                  " where reference=:reference and m_product_id=:m_product_id ",
                { reference: e.reference, m_product_id: e.m_product_id }
              )
              .then(function (result) {
                cb(result.rowsAffected);
                // console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
      case 8:
        connect
          .then(function (conn) {
            return conn
              .execute(
                " delete from xx_quota " + " where xx_quota_id=:xx_quota_id ",
                { xx_quota_id: e.xx_quota_id }
              )
              .then(function (result) {
                cb(result.rowsAffected);
                // console.log(result.rowsAffected);
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
        break;
    }
  }
  static selectByOne(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select ${e.select} 
       from xx_quota q 
       inner join m_product p on p.M_PRODUCT_ID=q.M_PRODUCT_ID
       inner join ad_user adu on adu.ad_user_id=q.createdby 
       inner join C_BPARTNER cb on cb.C_BPARTNER_ID=q.C_BPARTNER_ID
       ${e.where} `
          )
          .then(function (result) {
            cb(result.rows);
            // console.log(result.rowsAffected);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  static selectCondition(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(`${e}`)
          .then(function (result) {
            cb(result.rows);
            // console.log(result.rowsAffected);
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  static selectSql(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(`${e}`, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT })
          .then(function (result) {
            cb(result.rows);
            // console.log(result.rowsAffected);
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

module.exports = tabXx_quota;
