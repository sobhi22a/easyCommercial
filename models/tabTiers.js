const oracledb = require("oracledb");
var connect = require("../config/db");
const OracleDB = require("oracledb");

class tabTiers {
  constructor(row) {
    this.row = row;
  }

  static selectPromise(sql) {
    return connect
      .then(function (conn) {
        return conn
          .execute(`${sql}`, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT })
          .then(function (result) {
            return result.rows;
          })
          .catch(function (err) {
            console.error(err);
            throw err;
          });
      })
      .catch(function (err) {
        console.error(err);
        throw err;
      });
  }

  static UpdateCBPartnerShare(user_id, bpartner_id, id_org) {
    return new Promise((resolve, reject) => {
      connect
        .then(function (conn) {
          const sql = `update C_BP_Share set salesRep_id=${user_id},DATE_SORTIE_PROS=sysdate 
          where c_bpartner_id=${bpartner_id} and ad_org_id=${id_org}`;
          return conn
            .execute(sql, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT })
            .then(function (result) {
              resolve(result.rowsAffected);
            })
            .catch(function (err) {
              console.error(err);
              reject(err);
            });
        })
        .catch(function (err) {
          console.error(err);
        });
    });
  }

  static selectFeature(u, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(`${u}`, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT })
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
  static updateTiersFeature(sql) {
    return new Promise((resolve, reject) => {
      connect
        .then(function (conn) {
          return conn
            .execute(`${sql}`, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT })
            .then(function (result) {
              resolve(result.rowsAffected);
            })
            .catch(function (err) {
              console.error(err);
              reject(err);
            });
        })
        .catch(function (err) {
          console.error(err);
          reject(err);
        });
    });
  }
  static updateFeature(sql, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(`${sql}`, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT })
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

  static updatePromise(sql, cb) {
    return new Promise((resolve, reject) => {
      connect
        .then(function (conn) {
          return conn
            .execute(`${sql}`, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT })
            .then(function (result) {
              resolve(result.rowsAffected);
            })
            .catch(function (err) {
              console.error(err);
              reject(err);
            });
        })
        .catch(function (err) {
          console.error(err);
        });
    });
  }
  static selectClient(u, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            "select created from C_BP_Share  where c_bpartner_id=:c_bpartner_id and ad_org_id=:ad_org_id",
            { c_bpartner_id: u.c_bpartner_id, ad_org_id: u.ad_org_id }
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
  static paiement(u, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            `select PAYAMT , VERSE_PAYMENT_V1 (C_Payment_ID) as versement 
          from C_Payment where c_bpartner_id=${u.c_bpartner_id} AND isallocated='N' `
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
  static findOne(idu, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            // "select distinct o.c_bpartner_id,p.name from c_order o inner join c_bpartner p on o.c_bpartner_id=p.c_bpartner_id where o.salesrep_id=:id and o.docstatus ='IP'",{id:idu}
            " SELECT Distinct o.c_bpartner_id,bp.name,o.docstatus,i.docstatus,o.SALESREP_ID,o.ad_orgTrx_id,bp.zcreditmessage " +
              " FROM c_order o " +
              " FULL outer JOIN m_inout i " +
              " ON o.c_order_id=i.c_order_id " +
              " FULL outer join  C_BPARTNER bp " +
              " on o.C_BPARTNER_ID=bp.C_BPARTNER_ID " +
              " WHERE o.DOCSTATUS =:IP and o.salesrep_id=:id " +
              " and o.c_doctype_id in (1000539,1000540,1000542,1002679,1001851,1002662,1002664,1003102) " +
              " OR(o.DOCSTATUS =:CO  " +
              " AND i.docstatus=:IP " +
              " AND i.created >:dt " +
              " AND o.salesrep_id=:id " +
              " and o.c_doctype_id in (1000539,1000540,1000542,1002679,1001851,1002662,1002664,1003102)) " +
              " order by o.ad_orgTrx_id ",
            { id: idu.ad_user_id, dt: idu.dt, CO: "CO", IP: "IP" },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          )
          .then(function (result) {
            //console.log(result.rows);
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

  static select(e, cb) {
    switch (e.indice) {
      case 1:
        connect
          .then(function (conn) {
            return conn
              .execute("select name from c_bpartner where c_bpartner_id=:c_bpartner_id", { c_bpartner_id: e.c_bpartner_id })
              .then(function (result) {
                //console.log(result.rows);
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
      case 2:
        connect
          .then(function (conn) {
            return conn
              .execute(
                ` select bp.name as client,adu.name as oper ,csr.name as region,cbps.ad_org_id from  C_BP_Share cbps 
              inner join C_BPartner bp on bp.C_BPartner_id=cbps.C_BPartner_id
              inner join ad_user adu on adu.ad_user_id=cbps.salesrep_id
              inner join C_BPartner_Location cbpl on cbpl.C_BPartner_id=bp.C_BPartner_id
              inner join c_salesregion csr on csr.c_salesregion_id=cbpl.c_salesregion_id
              where bp.C_BP_Status_ID=${e.C_BP_Status_ID} 
              and csr.C_SALESREGION_ID in 
              (select C_SALESREGION_ID from C_SalesRegion_Share where XX_RECSUPERVISOR_ID =${e.XX_RECSUPERVISOR_ID})
              order by csr.name, bp.name  `,
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
        break;
    }
  }
  static clientParOper(idu, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            `select  bp.C_BPARTNER_ID ,bp.name,bps.SOCREDITSTATUS,sr.name ,bps.so_creditused ,
              bp.C_BP_Status_ID, bpl.phone,bps.ad_org_id,
              case 
              when bps.ad_org_id = 1000000 then 'ATTIRYAK'   
              when bps.ad_org_id = 1000416 then 'SEIF'
              when bps.ad_org_id = 1000517 then 'PALMA'
              else 'null' end as name_org
              from C_BPartner bp 
              full outer join C_BP_Share bps on bp.C_BPARTNER_ID=bps.C_BPARTNER_ID 
              full outer join AD_User  adu on bps.SALESREP_ID=adu.AD_User_ID 
              full outer join C_BPartner_Location bpl on bp.C_BPARTNER_ID=bpl.C_BPARTNER_ID 
              full outer join C_SalesRegion sr on bpl.C_SalesRegion_ID=sr.C_SalesRegion_ID 
              where bps.SALESREP_ID =:id 
              and bps.ISACTIVE='Y' and bp.ISCUSTOMER='Y' and bp.ISEMPLOYEE='N' 
              OR ( bps.XX_TEMPSALESREP_ID=:id and adu.XX_ISABSENT='Y' ) 
              order by bps.ad_org_id, bp.name`,
            { id: idu.id_user },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          )
          .then(function (result) {
            //console.log(result.rows);
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
  static clientProsp(u, cb) {
    connect
      .then(function (conn) {
        //rechercheProsp:rechercheProsp,id_org:id_org
        return conn
          .execute(
            `SELECT bp.C_BPARTNER_ID, bp.name, bps.SOCREDITSTATUS, sr.name, bps.so_creditused, au.name,
              bpl.phone, bps.SALESREP_ID, bps.ad_org_id,
              case 
              when bps.ad_org_id = 1000000 then 'ATTIRYAK'   
              when bps.ad_org_id = 1000416 then 'SEIF'
              when bps.ad_org_id = 1000517 then 'PALMA'
              else 'null' end as name_org
              FROM C_BPartner bp
              FULL OUTER JOIN C_BP_Share bps ON bp.C_BPARTNER_ID = bps.C_BPARTNER_ID
              LEFT JOIN AD_User au ON au.AD_User_id = bps.XX_LAST_SALESREP_ID
              LEFT JOIN C_BPartner_Location bpl ON bp.C_BPARTNER_ID = bpl.C_BPARTNER_ID
              INNER JOIN C_SalesRegion sr ON bpl.C_SalesRegion_ID = sr.C_SalesRegion_ID
              where bps.ISACTIVE = 'Y'
              AND bp.ISCUSTOMER = 'Y'
              AND bp.ISEMPLOYEE = 'N'
              AND bp.xx_black_liste = 'N' 
              AND bps.SALESREP_ID = 1044589
              AND (bps.xx_last_salesrep_id <> ${u.ad_user_id} OR bps.xx_last_salesrep_id is null)
              AND bp.name LIKE '%${u.rechercheProsp}%'
              AND bps.ad_org_id <> 1000519
              ORDER BY bp.name`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          )
          .then(function (result) {
            //console.log(result.rows);
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

  static donnerClientDebloque(u) {
    return new Promise((resolve, reject) => {
      connect
        .then(function (conn) {
          return conn
            .execute(
              `select distinct bp.name,
              bpl.C_SALESREGION_ID ,
              srg.name as nameRegion,
              srgs.XX_RECSUPERVISOR_ID,
              bpl.phone,xpb.phone ,
              au.name as nameSVR,
              cbps.socreditstatus,
              au1.name as nameLastOper,
              cbps.xx_lastsales,
              bp.zcreditmessage,
              bp.C_BP_Status_ID from C_BPARTNER bp
              full outer join C_BPartner_Location bpl on bp.c_bpartner_id=bpl.c_bpartner_id 
              full outer join C_SalesRegion srg on srg.C_SALESREGION_ID=bpl.C_SALESREGION_ID 
              full outer join C_SalesRegion_Share  srgs on srgs.C_SALESREGION_ID=srg.C_SALESREGION_ID 
              full outer join C_BP_Share cbps on bp.c_bpartner_id=cbps.c_bpartner_id 
              full outer join XX_PHONE_BOOK xpb on bp.c_bpartner_id=xpb.c_bpartner_id 
              full outer join AD_User au on au.AD_User_ID=srgs.xx_recsupervisor_id 
              full outer join AD_User au1 on cbps.xx_last_salesrep_id=au1.AD_User_ID 
              where cbps.c_bpartner_id=:u AND cbps.ad_org_id=:ad_org_id`,
              { u: u.id_Client, ad_org_id: u.id_org },
              { outFormat: oracledb.OUT_FORMAT_OBJECT }
            )
            .then(function (result) {
              resolve(result.rows);
            })
            .catch(function (err) {
              console.error(err);
              reject(err);
            });
        })
        .catch(function (err) {
          console.error(err);
        });
    });
  }

  static donnerClientDebloqueSeuil(u, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            "select distinct bp.name,bpl.C_SALESREGION_ID ,srg.name,srgs.XX_RECSUPERVISOR_ID,bpl.phone,xpb.phone ,au.name,au.ad_user_id,cbps.socreditstatus,au1.name,cbps.xx_lastsales,bp.C_BP_Status_ID from C_BPARTNER bp " +
              "full outer join C_BPartner_Location bpl " +
              "on bp.c_bpartner_id=bpl.c_bpartner_id " +
              "full outer join C_SalesRegion srg " +
              "on srg.C_SALESREGION_ID=bpl.C_SALESREGION_ID " +
              "full outer join C_SalesRegion_Share  srgs " +
              "on srgs.C_SALESREGION_ID=srg.C_SALESREGION_ID " +
              "full outer join C_BP_Share cbps " +
              "on bp.c_bpartner_id=cbps.c_bpartner_id " +
              "full outer join XX_PHONE_BOOK xpb " +
              "on bp.c_bpartner_id=xpb.c_bpartner_id " +
              "full outer join AD_User au " +
              "on au.AD_User_ID=srgs.xx_recsupervisor_id " +
              "full outer join AD_User au1 " +
              "on cbps.xx_last_salesrep_id=au1.AD_User_ID " +
              "where cbps.c_bpartner_id=:u and cbps.ad_org_id=:org",
            { u: u.id_Client, org: u.id_org },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          )
          .then(function (result) {
            // console.log(result.rows);
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

  static async debloqClientPros(u) {
    try {
      const conn = await connect;
      const result = await conn.execute(
        `UPDATE C_BP_Share SET 
          SALESREP_ID = :salesrep_id,
          SOCREDITSTATUS = :status,
          updatedby = :up 
         WHERE ad_org_id = :org AND C_BPARTNER_ID = :c_bpartner_id`,
        {
          status: u.status,
          salesrep_id: u.salesrep_id,
          org: u.ad_org_id,
          c_bpartner_id: u.c_bpartner_id,
          up: u.updatedby,
        }
      );
      return result.rowsAffected;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async debloqClient(u) {
    try {
      const conn = await connect;
      const result = await conn.execute(
        `UPDATE C_BP_Share SET 
          SOCREDITSTATUS = :status,
          updatedby = :up 
         WHERE ad_org_id = :org AND C_BPARTNER_ID = :client`,
        {
          status: u.status,
          up: u.updatedby,
          org: u.ad_org_id,
          client: u.c_bpartner_id,
        }
      );
      return result.rowsAffected;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static countInvoice(u, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            ` select TRK_Count_Open_Invoice(${u.c_bpartner_id},${u.ad_org_id}) as nmbr from dual `
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
  static balanceTiers(u, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select ad_org_id,TotalOpenBalance from C_BP_Share where c_bpartner_id=${u}`,
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            // `select rr."AD_ORG_ID",sum(rr.reste) over (partition by rr.name, rr.ad_org_id) as tot_reste_client
            //   from (SELECT DISTINCT i.AD_Org_ID, i.AD_Client_ID, bp.VALUE, bp.NAME, BP.C_BPARTNER_ID,I.ISRETURNTRX,
            //   i.documentno,isc.C_InvoiceSchedule_ID,isc.name as livr,so_creditlimit as limite,i.c_doctype_id,DT.NAME AS DOCTYPE,
            //   CASE WHEN i.c_doctype_id =1000002 THEN i.documentno END AS nfact,
            //   CASE WHEN i.c_doctype_id=1000004 OR i.c_doctype_id = 1000650 THEN i.documentno END AS navoir,
            //   CASE WHEN i.C_DocType_ID = 1000639 THEN i.documentno END AS NBL,
            //   i.dateinvoiced,i.dateinvoiced+pt.netdays AS date_echu,   i.grandtotal  AS grandtotal, i.c_invoice_id,
            //   COALESCE (verse(i.c_invoice_id),0) AS versement,
            //   CASE WHEN I.ISRETURNTRX='N' THEN i.grandtotal-COALESCE(verse(c_invoice_id),0)
            //       WHEN I.ISRETURNTRX='Y' THEN (-i.grandtotal-COALESCE(verse(c_invoice_id),0)) END AS reste,
            //   i.issotrx,i.docstatus, i.description,
            //   CASE WHEN ((SYSDATE - i.dateinvoiced ) >= pt.netdays) OR I.ISRETURNTRX='Y' THEN  'A' ELSE 'B' END AS CLSS,
            //   CASE WHEN ((SYSDATE - i.dateinvoiced ) >= pt.netdays) OR I.ISRETURNTRX='Y' THEN  'Echue' ELSE ' ' END AS echue
            //   FROM C_INVOICE i
            //   INNER JOIN C_BPARTNER bp ON (i.c_bpartner_id=bp.c_bpartner_id)
            //   LEFT OUTER JOIN C_InvoiceSchedule isc on bp.C_InvoiceSchedule_ID=isc.C_InvoiceSchedule_ID
            //   INNER JOIN C_PAYMENTTERM pt ON (i.c_paymentterm_id=pt.c_paymentterm_id)
            //   INNER JOIN C_DOCTYPE DT ON DT.C_DOCTYPE_ID=i.C_DOCTYPETARGET_ID
            //   WHERE   i.docstatus IN ('CO','CL') AND bp.C_BPARTNER_ID = ${u}
            //   AND I.issotrx='Y' AND ABS(CASE WHEN I.ISRETURNTRX='N' THEN i.grandtotal-COALESCE(verse(c_invoice_id),0)
            //       WHEN I.ISRETURNTRX='Y' THEN (-i.grandtotal-COALESCE(verse(c_invoice_id),0)) END)>100) rr
            //   LEFT OUTER JOIN
            //   (SELECT CASE WHEN ISRETURNTRX='N' THEN  grandtotal ELSE -grandtotal END AS grandtotalEchue,C_INVOICE_ID,DOCUMENTNO ,CASE WHEN ISRETURNTRX='N' THEN grandtotal-COALESCE(verse(c_invoice_id),0)
            //       WHEN ISRETURNTRX='Y' THEN (-grandtotal-COALESCE(verse(c_invoice_id),0)) END AS resteECHUE,COALESCE (verse(c_invoice_id),0) AS versementECHUE
            //   FROM C_INVOICE WHERE    paymentTermDueDate(C_PaymentTerm_ID,DATEINVOICED)<=SYSDATE OR ISRETURNTRX='Y' )R ON (R.C_INVOICE_ID=RR.C_INVOICE_ID)
            //   LEFT OUTER JOIN (SELECT C_BPARTNER_ID,SUM(TOTALLINES) AS NOTINVOICEDAMT FROM C_INVOICE_CANDIDATE_V GROUP BY C_BPARTNER_ID) IV ON rr.C_BPARTNER_ID=IV.C_BPARTNER_ID
            //   where round (rr.reste,2) <> 0
            //   order by rr."AD_ORG_ID" `
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
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
  static listeLivreur(cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            ` select 
      bp.C_BPARTNER_ID,bp.name
      from c_bpartner bp where C_BP_Group_ID=1000625 and isactive='Y' `
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
  static countClient(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            ` select 
      count(c_bpartner_id)
      from c_bpartner bp where c_bpartner_id in ${e} `
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
  static coordonner(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(` select xx_rc,xx_nif,xx_ai from c_bpartner where C_BPartner_ID=${e.c_bpartner_id} `)
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

  static updateTiersFeature(e, cb) {
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
  static updateTiers(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(` update C_BPartner ${e.set} ${e.where} `)
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

module.exports = tabTiers;
