var connect = require("../config/db");
const OracleDB = require("oracledb");

class tabCorder {
  constructor(row) {
    this.row = row;
  }
  static findAll1(d, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select distinct o.DOCUMENTNO,o.GRANDTOTAL 
               from C_ORDER o 
               full outer join m_inout io on io.C_ORDER_ID=o.C_ORDER_ID 
               where o.c_bpartner_id=:idClient and o.docstatus='IP' 
               and o.ad_orgTrx_id in (${d.ad_org_id}, 1000518) 
               and o.c_doctype_id in (1000539,1000540,1000542,1002679,1001851,1002662,1002664,1000541,1003102,1002678,1001845,1002679) 
               OR(o.DOCSTATUS ='CO' 
               AND io.docstatus='IP' 
               AND io.created > :dt 
               AND io.ad_orgTrx_id in (${d.ad_org_id}, 1000518) 
               AND o.c_bpartner_id=:idClient 
               and o.c_doctype_id in (1000539,1000540,1000542,1002679,1001851,1002662,1002664,1000541,1003102,1002678,1001845,1002679))`,
            { idClient: d.idClient, dt: d.dt }
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

  static finfAll(d, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            " select distinct o.C_ORDER_ID,o.DOCUMENTNO,o.GRANDTOTAL " +
              " from C_ORDER o " +
              " full outer join m_inout io " +
              " on io.C_ORDER_ID=o.C_ORDER_ID " +
              " where o.c_bpartner_id=:idClient and o.docstatus='IP' and o.docstatus='IP' " +
              " and o.c_doctype_id in (1000539,1000540,1000542,1002679,1001851,1002662,1002664,1000541,1003102,1002678,1001845,1002679) " +
              " OR(o.DOCSTATUS ='CO' " +
              " AND io.docstatus='IP' " +
              " AND io.created > :dt " +
              " AND o.c_bpartner_id=:idClient " +
              " and o.c_doctype_id in (1000539,1000540,1000542,1002679,1001851,1002662,1002664,1000541,1003102,1002678,1001845,1002679))",
            { idClient: d.e1, dt: d.dt }
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
  static findLine(d, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select pr.name,ol.QTYENTERED,ol.linenetamt,ol.xx_ug,pr.m_product_id,sc.value
            from c_orderline ol 
            inner join m_product pr on ol.M_PRODUCT_ID=pr.M_PRODUCT_ID 
            inner join XX_SalesContext sc on sc.XX_SalesContext_ID=pr.XX_SalesContext_ID
            WHERE c_order_id=${d} and qtyentered<>0 order by sc.value,pr.name`
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
  }

  static findLineCtx(d, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select sc.value,
              SUM(ol.QTYENTERED) QTYENTERED,sum(ol.linenetamt) linenetamt
              from c_orderline ol 
              inner join m_product pr on ol.M_PRODUCT_ID=pr.M_PRODUCT_ID 
              inner join XX_SalesContext sc on sc.XX_SalesContext_ID=pr.XX_SalesContext_ID
              WHERE c_order_id=${d} and qtyentered<>0
              group by sc.value
              order by sc.value`,
            {},
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
  }

  static findOrderConfirme(d, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            " select distinct o.c_order_id,o.DOCUMENTNO from c_order o " +
              " full outer join m_inout io " +
              " on o.c_order_id= io.c_order_id " +
              " where o.SALESREP_ID=:sr and o.C_BPartner_ID=:bp and o.DOCSTATUS='IP' " +
              " OR(o.DOCSTATUS ='CO' " +
              " AND io.docstatus='IP' " +
              " AND io.created > :dt " +
              " AND o.c_bpartner_id=:bp " +
              " AND io.SALESREP_ID=:sr " +
              " and o.c_doctype_id in (1000539,1000540,1000542,1002679,1001851,1002662,1002664,1000541,1003102,1002678,1001845,1002679))",
            { sr: d.sr, bp: d.bp, dt: d.dt }
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
  }
  static c_order_line(d, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            "select p.NAME as produit,sum(col.QTYORDERED) from c_order co inner join c_orderline col on co.c_order_id=col.c_order_id inner join m_product p on col.m_product_id=p.m_product_id inner join XX_SalesContext q on p.XX_SalesContext_ID=q.XX_SalesContext_ID where co.c_order_id =:idBcc and  (q.value='Q' or p.XX_SOUMIAPPROBATION='Y') and col.QTYENTERED>0 group by p.name",
            { idBcc: d }
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
  }
  static c_order_lineIn(d, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select p.NAME as produit,sum(col.QTYORDERED) from c_order co inner join c_orderline col on co.c_order_id=col.c_order_id inner join m_product p on col.m_product_id=p.m_product_id inner join XX_SalesContext q on p.XX_SalesContext_ID=q.XX_SalesContext_ID where co.c_order_id in ${d} and  (q.value='Q' or p.XX_SOUMIAPPROBATION='Y') and col.QTYENTERED>0 group by p.name`
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
  }

  static mntBcc(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(`select sum(GRANDTOTAL) from c_order where  c_order_id in ${e} `)
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
  static mntCorder(d, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(`select GRANDTOTAL,docstatus,CONSOMMATION_ORDER(${d}) as consomation from c_order WHERE c_order_id=${d}`)
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
  static bccParClient(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            " select distinct o.C_ORDER_ID,o.DOCUMENTNO ,o.GRANDTOTAL,o.DOCSTATUS " +
              " from C_ORDER o " +
              " full outer join m_inout io " +
              " on io.C_ORDER_ID=o.C_ORDER_ID " +
              " where o.C_BPartner_ID=:idbp and o.docstatus='IP' and o.SALESREP_ID=:idsal" +
              " and o.c_doctype_id in (1000539,1000540,1000542,1002679,1001851,1002662,1002664,1000541,1003102,1002678,1001845,1002679,1003102) " +
              " OR(o.DOCSTATUS ='CO' " +
              " AND io.docstatus='IP' " +
              " AND o.C_BPartner_ID=:idbp " +
              " and o.SALESREP_ID=:idsal " +
              " and io.created>=TRUNC(SYSDATE) " +
              " and o.c_doctype_id in (1000539,1000540,1000542,1002679,1001851,1002662,1002664,1000541,1003102,1002678,1001845,1002679,1003102))",
            { idbp: e.bp, idsal: e.sal },
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
  }

  static findByVenteFlash(cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select m_product_id,xx_ug,lastug 
      from XX_Arrivageline where XX_Arrivage_ID in (1354385,1354384)`
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
  }
  static findByVFproduit(m_product_id, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select m_product_id,xx_ug,lastug 
              from XX_Arrivageline 
              where XX_Arrivage_ID in (1354385,1354384) and m_product_id=${m_product_id}`
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
  }
}
module.exports = tabCorder;
