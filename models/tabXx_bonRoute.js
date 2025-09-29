const OracleDB = require("oracledb");
var connect = require("../config/db");

class tabXxbonRoute {
  constructor(row) {
    this.row = row;
  }

  static FindBonRouteByShipperAndDate(shipperId, startDate, endDate) {
    return new Promise((resolve, reject) => {
      connect
        .then(function (conn) {
          return conn
            .execute(
              `
            SELECT 
                TO_CHAR(DATEREPORT, 'DD/MM/YYYY') AS DATEREPORT,
                LISTAGG(xx_bonroute_id, ',') WITHIN GROUP (ORDER BY xx_bonroute_id) AS x_bonroute_ids,
                LISTAGG(DISTINCT C_SalesRegion_id, ',') WITHIN GROUP (ORDER BY C_SalesRegion_id) AS c_salesregion_ids
            FROM xx_bonroute
            WHERE XX_SHIPPER_ID = ${shipperId}
              AND isactive = 'Y'
              AND DATEREPORT >= TO_DATE('${startDate}', 'DD/MM/YYYY')
              AND DATEREPORT <= TO_DATE('${endDate}', 'DD/MM/YYYY')
            GROUP BY TO_CHAR(DATEREPORT, 'DD/MM/YYYY'), DATEREPORT
            ORDER BY DATEREPORT
            `,
              {},
              { outFormat: OracleDB.OUT_FORMAT_OBJECT }
            )
            .then(function (result) {
              resolve(result.rows);
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
    });
  }

  static FindNumberOfClients(bonRouteIds) {
    return new Promise((resolve, reject) => {
      connect
        .then(function (conn) {
          return conn
            .execute(
              `
              select count(distinct i.c_bpartner_id) as nbrClients from xx_bonrouteline brl
                inner join m_inout i on i.m_inout_id = brl.m_inout_id
                where xx_bonroute_id in (${bonRouteIds})
            `,
              {},
              { outFormat: OracleDB.OUT_FORMAT_OBJECT }
            )
            .then(function (result) {
              resolve(result.rows);
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
    });
  }

  static FindNumberOfPackages(bonRouteIds) {
    return new Promise((resolve, reject) => {
      connect
        .then(function (conn) {
          return conn
            .execute(
              `
             SELECT COUNT(m_package_id) AS NBRCOLIS
              FROM m_package
              WHERE m_inout_id IN (
                  SELECT m_inout_id
                  FROM xx_bonrouteline
                  WHERE isdelivered = 'Y'
                  AND xx_bonroute_id IN (${bonRouteIds}))
            `,
              {},
              { outFormat: OracleDB.OUT_FORMAT_OBJECT }
            )
            .then(function (result) {
              resolve(result.rows);
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
    });
  }

  static select(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select ad_org_id,documentno,to_char(DATEREPORT) as DATEREPORT,WHERECLAUSE,xx_bonroute_id
             from xx_bonroute where ${e.value} `
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
  static selectLivreur(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(`select ${e.variable} from TRK_EASY_RECOUV where ${e.value} `)
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

  static detailBonRoute(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select distinct inv.C_BPARTNER_ID,bp.name ,inv.GRANDTOTAL,inv.ISPAID,adu.name as oper,
    io.volume as CV, io.WEIGHT as CO,io.XX_SACHET as sachet,io.XX_BAG as insuline,brl.XX_ARRIVAL,
    brl.xx_bonrouteline_id
    from xx_bonroute br
    inner join XX_BONROUTELINE brl on brl.XX_BONROUTE_ID=br.XX_BONROUTE_ID
    INNER JOIN C_INVOICE inv on inv.c_invoice_id=brl.c_invoice_id
    inner join C_Order o on o.C_ORDER_ID=inv.C_ORDER_ID
    inner join M_InOut io on io.C_ORDER_ID=o.C_ORDER_ID
    inner join c_bpartner bp on inv.c_bpartner_id=bp.c_bpartner_id
    inner join ad_user adu on adu.ad_user_id=inv.SALESREP_ID
    where br.documentno='${e.documentno}' order by inv.C_BPARTNER_ID
     `
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

  static selectIsFar(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select bpl.C_SalesRegion_ID,srgl.c_salesregiongroup_id 
      from C_BPartner_Location bpl
      inner join C_SalesRegionGroupLine srgl on bpl.C_SalesRegion_ID=srgl.C_SalesRegion_ID
      where bpl.C_BPartner_ID=${e} `
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
  static countClients(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select count(distinct inv.C_BPARTNER_ID) as nbr from xx_bonroute br
    inner join xx_bonrouteline brl on br.xx_bonroute_id=brl.XX_BONROUTE_ID
    INNER join C_Invoice inv on brl.C_Invoice_ID=inv.C_Invoice_ID
    WHERE ${e.value} `
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
  static getChiffreRecouv(e) {
    return new Promise((resolve, reject) => {
      connect
        .then(function (conn) {
          return conn
            .execute(
              `
              SELECT round(SUM(PAYAMT),2) AS AMT  FROM C_Payment P
              INNER JOIN AD_USER U ON P.CREATEDBY=U.AD_USER_ID
              INNER JOIN C_DOCTYPE DT ON DT.C_DOCTYPE_ID=P.C_DOCTYPE_ID
              INNER JOIN C_BPARTNER BPC ON BPC.C_BPARTNER_ID=P.C_BPARTNER_ID
              INNER JOIN C_BPARTNER BP ON BP.C_BPARTNER_ID=U.C_BPARTNER_ID 
              INNER JOIN C_BANKACCOUNT BC ON BC.C_BANKACCOUNT_ID=P.C_BANKACCOUNT_ID
              INNER JOIN C_BANK BK ON BK.C_BANK_ID=BC.C_BANK_ID
              INNER JOIN AD_ORG ORG ON ORG.AD_ORG_ID=P.AD_ORG_ID
              WHERE DOCSTATUS IN ('CO','CL')  AND  DATEACCT>='${e.dateA}' AND DATEACCT<='${e.dateB}'
              AND BPC.ISCUSTOMER='Y' AND DT.DOCBASETYPE='ARR' AND P.C_BankAccount_ID=1000915 
              AND P.ISINDISPUTE='N' AND BP.C_BP_Group_ID=1000625
              AND BP.C_BPARTNER_ID=${e.c_bpartner_id}
              GROUP BY BP.NAME
            `,
              {},
              { outFormat: OracleDB.OUT_FORMAT_OBJECT }
            )
            .then(function (result) {
              resolve(result.rows);
              //console.log(result.rowsAffected);
            })
            .catch(function (err) {
              console.error(err);
            });
        })
        .catch(function (err) {
          console.error(err);
        });
    });
  }

  static collisage(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
    SELECT 
    sum(i.VOLUME +i.WEIGHT +i.XX_CO_CH+i.XX_CV_CH+i.XX_SACHET) AS TotalColis
    
  FROM XX_BonRouteLine brl
  INNER JOIN XX_BonRoute br ON (brl.XX_BonRoute_id=br.XX_BonRoute_id)
  inner join ad_org org on br.ad_org_id=org.ad_org_id
  LEFT OUTER JOIN m_inout i ON i.M_INOUT_ID=brl.M_INOUT_ID
  LEFT OUTER JOIN C_INVOICE IV ON IV.C_INVOICE_ID=brl.C_INVOICE_ID
  LEFT OUTER JOIN c_bpartner lv ON lv.C_BPARTNER_ID=br.XX_SHIPPER_ID
  LEFT OUTER JOIN C_BPARTNER TR ON TR.C_BPARTNER_ID=br.XX_BPARTNERSHIPPER_ID
  LEFT OUTER JOIN C_BPARTNER BP ON BP.C_BPARTNER_ID=i.C_BPARTNER_ID
  LEFT OUTER JOIN C_BPARTNER_LOCATION BPL ON BPL.C_BPARTNER_LOCATION_ID=i.C_BPARTNER_LOCATION_ID
  LEFT OUTER JOIN C_SalesRegion SR ON SR.C_SALESREGION_ID=BPL.C_SALESREGION_ID
  LEFT OUTER JOIN DD_Vehicle VC ON VC.DD_VEHICLE_ID=br.DD_VEHICLE_ID
  LEFT OUTER JOIN DD_Brand BD ON BD.DD_BRAND_ID=VC.DD_BRAND_ID
  LEFT OUTER JOIN DD_VehicleType VCT ON VCT.DD_VehicleType_ID =VC.DD_VehicleType_ID
  LEFT OUTER JOIN R_Request RQ ON RQ.R_Request_ID=BRL.R_Request_ID
  LEFT OUTER JOIN C_BPARTNER BPR ON BPR.C_BPARTNER_ID=RQ.C_BPARTNER_ID
  LEFT OUTER JOIN R_Group GR ON  GR.R_Group_ID=RQ.R_Group_ID
  WHERE BRL.XX_BonRoute_ID in ${e}
    `
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

  static selectRegoin(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            ` select distinct sr.C_SalesRegion_id,sr.name from C_SalesRegion_Share srs
    inner join C_SalesRegion sr on sr.C_SalesRegion_id=srs.C_SalesRegion_id
    where srs.XX_RECSUPERVISOR_ID=${e.id_svr}
    `
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
}
module.exports = tabXxbonRoute;
