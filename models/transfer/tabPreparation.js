const OracleDB = require("oracledb");
var connect = require("../../config/db");

class tabPreparation {
  constructor(row) {
    this.row = row;
  }
  //feature
  static FindProgrammeJourRepository(date) {
    return new Promise((resolve, reject) => {
      connect
        .then(function (conn) {
          return conn
            .execute(
              `select * from XX_ProgrammeJour where TRUNC(datecreated) = TRUNC(TO_DATE('${date}', 'YYYY/MM/DD'))`,
              {},
              { outFormat: OracleDB.OUT_FORMAT_OBJECT }
            )
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
    });
  }
  static FindStatRectifPreparateurRepository(XX_ProgrammeJour_ID) {
    return new Promise((resolve, reject) => {
      connect
        .then(function (conn) {
          return conn
            .execute(
              `select 
                  ingl.XX_Preparateur_ID, 
                  MAX(u.name) as name, 
                  count(ingl.m_product_id) as m_product_id, 
                  sum(ingl.Orig_QtyEntered) as Orig_QtyEntered, 
                  sum(ingl.QtyCount) as QtyCount,
                  sum(ingl.Orig_QtyEntered) - sum(ingl.QtyCount) as DiffQty
              from M_InOutGroupLine ingl
              left outer join ad_user u on ingl.XX_Preparateur_ID = u.ad_user_id
              where ingl.M_InOutGroup_ID in (select M_InOutGroup_ID from M_InOutGroup  where XX_ProgrammeJour_ID = ${XX_ProgrammeJour_ID}) and ingl.Orig_QtyEntered <> ingl.QtyCount
              group by ingl.XX_Preparateur_ID
              order by name`,
              {},
              { outFormat: OracleDB.OUT_FORMAT_OBJECT }
            )
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
    });
  }

  static FindStatRectifControleurRepository(XX_ProgrammeJour_ID) {
    return new Promise((resolve, reject) => {
      connect
        .then(function (conn) {
          return conn
            .execute(
              `select 
                  ingl.XX_Controleur_ID, 
                  MAX(u.name) as name, 
                  count(ingl.m_product_id) as m_product_id, 
                  sum(ingl.Orig_QtyEntered) as Orig_QtyEntered, 
                  sum(ingl.QtyDelivered) as QtyDelivered,
                  sum(ingl.Orig_QtyEntered) - sum(ingl.QtyDelivered) as DiffQty
              from M_InOutGroupLine ingl
              left outer join ad_user u on ingl.XX_Controleur_ID = u.ad_user_id
              where ingl.M_InOutGroup_ID in (select M_InOutGroup_ID from M_InOutGroup  where XX_ProgrammeJour_ID = ${XX_ProgrammeJour_ID}) and ingl.Orig_QtyEntered <> ingl.QtyDelivered
              group by ingl.XX_Controleur_ID
              order by name`,
              {},
              { outFormat: OracleDB.OUT_FORMAT_OBJECT }
            )
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
    });
  }

  static featureUpdateMinoutGroupLine(sql, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
          ${sql} 
          `
          )
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
  static featureUpdate(sql, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
          ${sql} 
          `
          )
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
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
             SELECT R.*,
              CASE
                WHEN R.M_Product_Category_ID=1000859
                THEN 'P'
                ELSE ' '
              END AS ProductType,
              (SELECT name FROM C_SalesRegionGroup WHERE C_SalesRegionGroup_ID=${e.C_SalesRegionGroup_ID}
              ) AS region
            FROM
              (SELECT *
              FROM
                (SELECT  to_char(ig.MOVEMENTDATE) as movementdate ,
                  p.name AS produit ,
                  p.isColdChain,
                  p.M_PRODUCT_ID ,
                  p.XX_ExclueControleLot,
                  p.XX_ExclueControlePPA,
                  p.XX_ExclueControleDate,
                  to_char(asi.GUARANTEEDATE) as guaranteedate ,
                  lc.description AS empl,
                  lc.M_Locator_ID,
                  round(aPPA.VALUENUMBER,2) as ppa,
                  SUM(il.MOVEMENTQTY) AS qty,
                  ig.C_BPARTNER_ID,
                 ig.AD_Org_ID,
                  ig.M_InoutGroup_ID,
                  ig.documentno,
                  P.M_Product_Category_ID,
                  bpl.C_SalesRegion_ID,
                  sr.name as srg,
                  max(igl.XX_Preparateur_ID) as XX_Preparateur_ID ,
                  max(igl.XX_Controleur_ID) as XX_Controleur_ID ,
                  max(IL.isconfirmed) as isconfirmed ,
                  igl.ppa as ppaRectif,
                  to_char(igl.guaranteedate) as dateRectif,
                  igl.lotRectif,
                  igl.m_inoutgroupline_id ,
                  sum(igl.qtycount) as qtycount,
                  sum(igl.qtydelivered) as qtydelivered,
                  max(ig.isPrepared) as isPrepared,
                  max(ig.volume) as CO,
                  max(ig.weight) as CV,
                  max(ig.xx_sachet) as sachet,
                  max(ig.xx_bag) as bag,
                  max(ig.IsLabelScaned) as IsLabelScaned,
                  PKT.LINENO AS NBRC,
                  asi.lot
                FROM M_InOutLine il
                INNER JOIN M_InOut i ON il.M_InOut_ID=i.M_InOut_ID
                INNER JOIN M_InOutGroupLine igl  ON il.M_InOutGroupLine_ID=igl.M_InOutGroupLine_ID
                LEFT OUTER JOIN M_Locator lc ON lc.M_Locator_ID=il.XX_LocatorSource_ID
                INNER JOIN M_InOutGroup ig  ON igl.M_InOutGroup_ID=ig.M_InOutGroup_ID
                INNER JOIN M_Product p ON p.M_Product_ID=igl.M_Product_ID
                LEFT OUTER JOIN m_attributesetinstance asi ON asi.M_attributesetinstance_ID = igl.M_attributesetinstance_ID
                LEFT OUTER JOIN M_AttributeInstance aPPA  ON appa.m_attributesetinstance_id = igl.m_attributesetinstance_id AND aPPA.m_attribute_id = 1000503
                LEFT OUTER JOIN C_BPartner_Location bpl  ON bpl.C_BPartner_Location_ID=ig.C_BPartner_Location_ID
                LEFT OUTER JOIN C_SalesRegion sr  ON bpl.C_SalesRegion_ID   =sr.C_SalesRegion_ID
                LEFT OUTER JOIN C_SalesRegionGroupLine srg  ON bpl.C_SalesRegion_ID        =srg.C_SalesRegion_ID
                LEFT OUTER JOIN M_PICKTABLE PKT ON PKT.M_PICKTABLE_ID = IG.M_PICKTABLE_ID
                WHERE srg.C_SalesRegionGroup_ID=${e.C_SalesRegionGroup_ID}
                AND ig.movementdate           >='${e.date}'
                AND ig.movementdate           <='${e.date}'
                AND i.ISQR                     ='${e.qr}'
                AND p.isColdChain = '${e.isColdChain}'
                AND (BPL.c_salesregion_id in (${e.c_salesregion_id}) OR  ${e.c_salesregion_idVar} is null)
                AND p.M_Product_Category_ID   <>1000658
                GROUP BY ig.MOVEMENTDATE,
                  p.name ,
                  p.isColdChain,
                  p.M_PRODUCT_ID,
                  p.XX_ExclueControleLot,
                  p.XX_ExclueControlePPA,
                  p.XX_ExclueControleDate,
                  lc.description,
                  lc.M_Locator_ID,
                  asi.GUARANTEEDATE,
                  aPPA.VALUENUMBER,
                  ig.C_BPARTNER_ID,
                  ig.AD_Org_ID,
                  ig.M_InoutGroup_ID,
                  ig.documentno,
                  P.M_Product_Category_ID,
                  bpl.C_SalesRegion_ID,
                  sr.name,
                  igl.ppa,
                  igl.guaranteedate ,
                  igl.lotRectif,
                  igl.m_inoutgroupline_id,
                  PKT.LINENO,
                  asi.lot
                ORDER BY p.name
                )
              ) R
            ORDER BY produit,
              nbrc
              `,
            {},
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

  static selectChambre(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
            SELECT R.*,
              CASE
                WHEN R.M_Product_Category_ID=1000859
                THEN 'P'
                ELSE
               case when R.C_PaymentTerm_ID=1002364 THEN 'PSC' 
                ELSE  ' ' END
              END AS ProductType
            FROM
              (SELECT *
              FROM
                (SELECT  to_char(ig.MOVEMENTDATE) as movementdate ,
                  p.name AS produit ,
                  p.isColdChain,
                  p.M_PRODUCT_ID ,
                  p.XX_ExclueControleLot,
                  p.XX_ExclueControlePPA,
                  p.XX_ExclueControleDate,
                  p.C_PaymentTerm_ID,
                  to_char(asi.GUARANTEEDATE) as guaranteedate ,
                  lc.description AS empl,
                  lc.M_Locator_ID,
                  round(aPPA.VALUENUMBER,2) as ppa,
                  SUM(il.MOVEMENTQTY) AS qty,
                  ig.C_BPARTNER_ID,
                  ig.AD_Org_ID,
                  ig.M_InoutGroup_ID,
                  ig.documentno,
                  P.M_Product_Category_ID,
                  bpl.C_SalesRegion_ID,
                  sr.name as srg,
                  max(igl.XX_Preparateur_ID) as XX_Preparateur_ID ,
                  max(igl.XX_Controleur_ID) as XX_Controleur_ID ,
                  max(IL.isconfirmed) as isconfirmed ,
                  igl.ppa as ppaRectif,
                  TO_CHAR(igl.guaranteedate) as dateRectif,
                  igl.lotRectif,
                  igl.m_inoutgroupline_id ,
                  sum(igl.qtycount) as qtycount,
                  sum(igl.qtydelivered) as qtydelivered,
                  max(ig.isPrepared) as isPrepared,
                  max(ig.volume) as CO,
                  max(ig.weight) as CV,
                  max(ig.xx_sachet) as sachet,
                  max(ig.xx_bag) as bag,
                  max(ig.IsLabelScaned) as IsLabelScaned,
                  PKT.LINENO AS NBRC,
                  asi.lot
                FROM M_InOutLine il
                INNER JOIN M_InOut i ON il.M_InOut_ID=i.M_InOut_ID
                INNER JOIN M_InOutGroupLine igl  ON il.M_InOutGroupLine_ID=igl.M_InOutGroupLine_ID
                LEFT OUTER JOIN M_Locator lc ON lc.M_Locator_ID=il.XX_LocatorSource_ID
                INNER JOIN M_InOutGroup ig  ON igl.M_InOutGroup_ID=ig.M_InOutGroup_ID
                INNER JOIN M_Product p ON p.M_Product_ID=igl.M_Product_ID
                LEFT OUTER JOIN m_attributesetinstance asi ON asi.M_attributesetinstance_ID = igl.M_attributesetinstance_ID
                LEFT OUTER JOIN M_AttributeInstance aPPA  ON appa.m_attributesetinstance_id = igl.m_attributesetinstance_id AND aPPA.m_attribute_id = 1000503
                LEFT OUTER JOIN C_BPartner_Location bpl  ON bpl.C_BPartner_Location_ID=ig.C_BPartner_Location_ID
                LEFT OUTER JOIN C_SalesRegion sr  ON bpl.C_SalesRegion_ID   =sr.C_SalesRegion_ID
                LEFT OUTER JOIN M_PICKTABLE PKT ON PKT.M_PICKTABLE_ID = IG.M_PICKTABLE_ID
                WHERE  ig.movementdate           >='${e.date}'
                AND ig.movementdate           <='${e.date}'
                AND i.ISQR                     ='${e.qr}'
                AND p.M_Product_Category_ID   <>1000658
                GROUP BY ig.MOVEMENTDATE,
                  p.name ,
                  p.isColdChain,
                  p.M_PRODUCT_ID,
                  p.XX_ExclueControleLot,
                  p.XX_ExclueControlePPA,
                  p.XX_ExclueControleDate,
                  p.C_PaymentTerm_ID,
                  lc.description,
                  lc.M_Locator_ID,
                  asi.GUARANTEEDATE,
                  aPPA.VALUENUMBER,
                  ig.C_BPARTNER_ID,
                  ig.AD_Org_ID,
                  ig.M_InoutGroup_ID,
                  ig.documentno,
                  P.M_Product_Category_ID,
                  bpl.C_SalesRegion_ID,
                  sr.name,
                  igl.ppa,
                  igl.lotRectif,
                  igl.guaranteedate ,
                  igl.m_inoutgroupline_id,
                  PKT.LINENO,
                  asi.lot
                ORDER BY p.name
                )
              ) R
            ORDER BY produit,
              nbrc
              `,
            {},
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

  static selectParametre(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
            select C_SALESREGIONGROUP_ID,name from C_SalesRegionGroup where (netday = ${e.netday} or  netday is null) and isactive='Y'  order by name
            `
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
  static selectEmpl(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
          ${e} 
          `,
            {},
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
  static selectC_SalesRegionGroupLine(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
            select ${e.select} from C_SalesRegionGroupLine srgl inner join C_SalesRegion sr 
            on sr.C_SalesRegion_ID=srgl.C_SalesRegion_ID ${e.where}
          `
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

  static updateLineGroup(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `UPDATE M_InOutGroupLINE 
        SET XX_PREPARATEUR_ID=${e.xx_preparateur_id}, qtycount=${e.qtycount},description='${e.description}'
        where m_inoutgroupline_id= ${e.m_inoutgroupline_id} `
          )
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
  static updateMinoutGroupLine(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
        UPDATE M_InOutGroupLINE ${e.set} ${e.where} 
        `
          )
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
  static updateM_InOutGroup(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
        UPDATE M_InOutGroup ${e.set} ${e.where} 
        `
          )
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

  static selectPickTable(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            ` 
        select ${e.select} from M_PickTable ${e.where}
        `
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
  static selectMinoutGroupline(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            ` 
        select ${e.select} from m_inoutgroupline ${e.where}
        `,
            {},
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

  static selectIsInserted(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
          SELECT R.*,
          CASE
            WHEN R.M_Product_Category_ID=1000859
            THEN 'P'
            ELSE ' '
          END AS ProductType,
          (SELECT name FROM C_SalesRegionGroup WHERE C_SalesRegionGroup_ID=1000005
          ) AS region
        FROM
          (SELECT *
          FROM
            (SELECT  to_char(ig.MOVEMENTDATE) as movementdate ,
              p.name AS produit ,
              p.M_PRODUCT_ID ,
              to_char(asi.GUARANTEEDATE) as guaranteedate ,
              lc.description AS empl,
              lc.M_Locator_ID,
              round(aPPA.VALUENUMBER,2) as ppa,
              SUM(il.MOVEMENTQTY) AS qty,
              ig.C_BPARTNER_ID,
              ig.AD_Org_ID,
              ig.M_InoutGroup_ID,
              ig.documentno,
              P.M_Product_Category_ID,
              bpl.C_SalesRegion_ID,
              sr.name as srg,
              max(igl.XX_Preparateur_ID) as XX_Preparateur_ID ,
              max(igl.XX_Controleur_ID) as XX_Controleur_ID ,  
              igl.m_inoutgroupline_id ,
              sum(igl.qtycount) as qtycount,
              sum(igl.qtydelivered) as qtydelivered,
              max(ig.isPrepared) as isPrepared,
              max(ig.volume) as CO,
              max(ig.weight) as CV,
              max(ig.xx_sachet) as sachet,
              max(ig.xx_bag) as bag,
              (SELECT NBRC
              FROM
                (SELECT ROWNUM AS NBRC ,
                  P.*
                FROM
                  (SELECT  to_char(ig.MOVEMENTDATE),
                    SUM(igl.MOVEMENTQTY) AS qty,
                    ig.C_BPARTNER_ID,
                    COUNT(M_InOutGroupLine_id)
                  FROM M_InOutGroupLine igl
                  INNER JOIN M_InOutGroup ig
                  ON igl.M_InOutGroup_ID=ig.M_InOutGroup_ID
                  INNER JOIN M_Product p
                  ON p.M_Product_ID=igl.M_Product_ID
                  LEFT OUTER JOIN m_attributesetinstance asi
                  ON asi.M_attributesetinstance_ID = igl.M_attributesetinstance_ID
                  LEFT OUTER JOIN M_AttributeInstance aPPA
                  ON appa.m_attributesetinstance_id = igl.m_attributesetinstance_id
                  AND aPPA.m_attribute_id           = 1000503
                  LEFT OUTER JOIN C_BPartner_Location bpl
                  ON bpl.C_BPartner_Location_ID=ig.C_BPartner_Location_ID
                  LEFT OUTER JOIN C_SalesRegionGroupLine srg
                  ON bpl.C_SalesRegion_ID        =srg.C_SalesRegion_ID
                  WHERE srg.C_SalesRegionGroup_ID=${e.C_SalesRegionGroup_ID}
                  AND ig.movementdate           >='${e.date}'
                  AND ig.movementdate           <='${e.date}'
                  AND p.ISQR                     ='${e.qr}'
                  and igl.m_inoutgroupline_id not in (${e.mInoutlinegrouplineId})
                  AND (BPL.c_salesregion_id in (${e.c_salesregion_id}) OR ${e.c_salesregion_idVar} is null)
                  AND igl.MOVEMENTQTY            >0
                  AND p.M_Product_Category_ID   <>1000658
                  GROUP BY ig.MOVEMENTDATE,
                    ig.C_BPARTNER_ID
                  ORDER BY SUM(igl.MOVEMENTQTY)*COUNT(M_InOutGroupLine_id) DESC,
                    ig.C_BPARTNER_ID
                  ) P
                )
              WHERE C_BPARTNER_ID=IG.C_BPARTNER_ID
              ) AS NBRC
            FROM M_InOutLine il
            INNER JOIN M_InOutGroupLine igl
            ON il.M_InOutGroupLine_ID=igl.M_InOutGroupLine_ID
            LEFT OUTER JOIN M_Locator lc
            ON lc.M_Locator_ID=il.XX_LocatorSource_ID
            INNER JOIN M_InOutGroup ig
            ON igl.M_InOutGroup_ID=ig.M_InOutGroup_ID
            INNER JOIN M_Product p
            ON p.M_Product_ID=igl.M_Product_ID
            LEFT OUTER JOIN m_attributesetinstance asi
            ON asi.M_attributesetinstance_ID = igl.M_attributesetinstance_ID
            LEFT OUTER JOIN M_AttributeInstance aPPA
            ON appa.m_attributesetinstance_id = igl.m_attributesetinstance_id
            AND aPPA.m_attribute_id           = 1000503
            LEFT OUTER JOIN C_BPartner_Location bpl
            ON bpl.C_BPartner_Location_ID=ig.C_BPartner_Location_ID
            LEFT OUTER JOIN C_SalesRegion sr
            ON bpl.C_SalesRegion_ID   =sr.C_SalesRegion_ID
            LEFT OUTER JOIN C_SalesRegionGroupLine srg
            ON bpl.C_SalesRegion_ID        =srg.C_SalesRegion_ID
            WHERE srg.C_SalesRegionGroup_ID=${e.C_SalesRegionGroup_ID}
            AND ig.movementdate           >='${e.date}'
            AND ig.movementdate           <='${e.date}'
            AND p.ISQR                     ='${e.qr}'
            and igl.m_inoutgroupline_id not in (${e.mInoutlinegrouplineId})
            AND (BPL.c_salesregion_id in (${e.c_salesregion_id}) OR  ${e.c_salesregion_idVar} is null)
            AND igl.MOVEMENTQTY            >0
            AND p.M_Product_Category_ID   <>1000658
            GROUP BY ig.MOVEMENTDATE,
              p.name ,
              p.M_PRODUCT_ID,
              lc.description,
              lc.M_Locator_ID,
              asi.GUARANTEEDATE,
              aPPA.VALUENUMBER,
              ig.C_BPARTNER_ID,
              ig.AD_Org_ID,
              ig.M_InoutGroup_ID,
              ig.documentno,
              P.M_Product_Category_ID,
              bpl.C_SalesRegion_ID,
              sr.name,
              igl.m_inoutgroupline_id 
            ORDER BY p.name
            )
          ) R
        ORDER BY produit,
          nbrc
          `,
            {},
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
}

module.exports = tabPreparation;
