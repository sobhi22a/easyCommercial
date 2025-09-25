var connect = require("../../config/db");
const OracleDB = require("oracledb");

class tabTransfer {
  constructor(row) {
    this.row = row;
  }
  static async selectProductToDtQRY(query) {
    try {
      var sql = `SELECT ls.VALUE AS LOCATORSOURCE,
      ls.m_locator_id,
      'ALL' AS GROUPREGION,
      p.m_product_id,
      p.NAME || ' ' || P.VERSIONNO AS NAME,
      CASE
          WHEN SLC.VALUE = 'Q' THEN 'Q'
          ELSE ' '
      END AS QUOTA,
      P.ISQR AS QR,
      aPPA.VALUENUMBER AS PPA,
      aSHP.VALUENUMBER AS SHP,
      ASI.LOT,
      TO_CHAR(asi.GUARANTEEDATE) AS GUARANTEEDATE,
      BP.NAME AS Fournisseur,
      SUM(il.MOVEMENTQTY) AS MOVEMENTQTY,
      SUM(il.Orig_QtyEntered)                    AS OrigQtyEntered,
      MAX(il.QtyMovemented) AS QtyMovemented,
      MAX(il.QtyMovementedCtrl) AS QtyMovementedCtrl,
      MAX(il.Description_flutter) AS Description_flutter,
      0 AS C_SALESREGIONGROUP_ID,
      LISTAGG(il.M_InoutLine_ID, ',') WITHIN GROUP (
          ORDER BY ls.VALUE,
                   p.NAME,
                   P.VERSIONNO,
                   SLC.VALUE,
                   P.ISCHER,
                   P.ISQR,
                   aPPA.VALUENUMBER,
                   ASI.LOT,
                   asi.GUARANTEEDATE,
                   aSHP.VALUENUMBER,
                   BP.NAME,
                   ls.m_locator_id,
                   p.m_product_id,
                   il.XX_CONTROLEURTR_ID,
                   il.XX_PREPARATEURTR_ID
      ) mInoutlineIdList,
      il.XX_CONTROLEURTR_ID,
      il.XX_PREPARATEURTR_ID,
      UP.NAME AS PREPARATEUR,
      UC.NAME AS CONTROLEUR,
      P.XX_Forme_ID,
      FM.DESCRIPTION AS FORM
      FROM M_InoutLine il
      INNER JOIN M_Product p ON il.m_product_id = P.M_PRODUCT_ID
      LEFT OUTER JOIN AD_USER UP ON UP.AD_USER_ID = IL.XX_PREPARATEURTR_ID
      LEFT OUTER JOIN AD_USER UC ON UC.AD_USER_ID = IL.XX_CONTROLEURTR_ID
      LEFT OUTER JOIN XX_Forme FM ON FM.XX_Forme_ID = P.XX_Forme_ID
      INNER JOIN XX_SalesContext SLC ON SLC.XX_SalesContext_ID = P.XX_SalesContext_ID
      INNER JOIN M_Attributesetinstance asi ON asi.M_ATTRIBUTESETINSTANCE_ID = il.M_ATTRIBUTESETINSTANCE_ID
      LEFT OUTER JOIN M_AttributeInstance aPPA ON appa.m_attributesetinstance_id = il.m_attributesetinstance_id
                                               AND aPPA.m_attribute_id = 1000503
      LEFT OUTER JOIN M_AttributeInstance aSHP ON aSHP.m_attributesetinstance_id = il.m_attributesetinstance_id
                                               AND aSHP.m_attribute_id = 1000506
      LEFT OUTER JOIN M_AttributeInstance fr ON FR.m_attributesetinstance_id = il.m_attributesetinstance_id
                                              AND FR.m_attribute_id = 1000508
      LEFT OUTER JOIN C_BPARTNER BP ON BP.C_BPARTNER_ID = fr.VALUENUMBER
      INNER JOIN M_InOutGroupLine ILG ON IL.M_InOutGroupLine_ID = ILG.M_InOutGroupLine_ID
      INNER JOIN M_InOutGroup IG ON IG.M_InOutGroup_ID = ILG.M_InOutGroup_ID
      INNER JOIN M_Inout I ON I.M_INOUT_ID = il.M_INOUT_ID
      INNER JOIN C_DocType DOC ON I.C_DocType_ID = DOC.C_DocType_ID
      INNER JOIN C_Bpartner_Location bpl ON bpl.C_BPARTNER_LOCATION_ID = I.C_BPARTNER_LOCATION_ID
      INNER JOIN C_SalesRegion SR ON SR.C_SalesRegion_ID = bpl.C_SALESREGION_ID
      INNER JOIN m_locator ls ON ls.M_LOCATOR_ID = il.XX_LOCATORSOURCE_ID
WHERE i.docstatus IN ('IP', 'CO', 'CL', 'DR')
  AND i.issotrx = 'Y'
  AND I.ISRETURNTRX = 'N'
  AND i.XX_ISDEJASERVI = 'N'
  AND IL.MOVEMENTQTY > 0
  AND I.ISQR = '${query.isQr}'
  AND IG.MOVEMENTDATE = '${query.date}'
  AND ls.XX_PREPARATEURTR_ID = ${query.userSelected}
GROUP BY ls.VALUE,
      p.NAME,
      P.VERSIONNO,
      SLC.VALUE,
      P.ISCHER,
      P.ISQR,
      aPPA.VALUENUMBER,
      ASI.LOT,
      asi.GUARANTEEDATE,
      aSHP.VALUENUMBER,
      BP.NAME,
      ls.m_locator_id,
      p.m_product_id,
      il.XX_CONTROLEURTR_ID,
      il.XX_PREPARATEURTR_ID,
      UP.NAME,
      UC.NAME,
      P.XX_Forme_ID,
      FM.NAME,
      FM.DESCRIPTION
      ORDER BY ls.VALUE,
      FM.DESCRIPTION,
      p.NAME`;
      const connection = await connect;
      const result = await connection.execute(sql, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT });
      return result.rows;
    } catch (error) {
      console.error("error Existe" + error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }

  static async selectProductToDtQRN(query) {
    try {
      var sql = ` SELECT ls.VALUE AS LOCATORSOURCE,
      ls.m_locator_id,
      GSRG.NAME AS GROUPREGION,
      p.m_product_id,
      p.XX_ExclueControleLot,
      p.XX_ExclueControlePPA,
      p.XX_ExclueControleDate,
      p.NAME
      ||'   '
      ||P.VERSIONNO AS NAME,
      CASE
        WHEN SLC.VALUE='Q'
        THEN 'Q'
        ELSE ' '
      END              AS QUOTA,
      P.ISQR           AS QR,
      aPPA.VALUENUMBER AS PPA,
      aSHP.VALUENUMBER AS SHP,
      ASI.LOT,
      TO_CHAR(asi.GUARANTEEDATE)             AS GUARANTEEDATE,
      BP.NAME                                AS Fournisseur,
      SUM(il.MOVEMENTQTY)                    AS MOVEMENTQTY,
      SUM(il.Orig_QtyEntered)                    AS OrigQtyEntered,
      MAX(il.QtyMovemented)                    AS QtyMovemented,
      MAX(il.QtyMovementedCtrl)                    AS QtyMovementedCtrl,
      MAX(il.Description_flutter) AS Description_flutter,
      COALESCE (SRG.C_SALESREGIONGROUP_ID,0) AS C_SALESREGIONGROUP_ID,
      LISTAGG(il.M_InoutLine_ID, ',') WITHIN GROUP (
    ORDER BY ls.VALUE,
      GSRG.NAME,
      p.NAME,
      P.VERSIONNO,
      SLC.VALUE,
      P.ISCHER,
      P.ISQR,
      aPPA.VALUENUMBER ,
      ASI.LOT,
      asi.GUARANTEEDATE,
      aSHP.VALUENUMBER ,
      BP.NAME ,
      SRG.C_SALESREGIONGROUP_ID,
      ls.m_locator_id,
      p.m_product_id,
      p.XX_ExclueControleLot,
      p.XX_ExclueControlePPA,
      p.XX_ExclueControleDate,
      il.XX_CONTROLEURTR_ID,
      il.XX_PREPARATEURTR_ID) mInoutlineIdList,
      il.XX_CONTROLEURTR_ID,
      il.XX_PREPARATEURTR_ID,
      UP.NAME AS PREPARATEUR,
      UC.NAME AS CONTROLEUR,
      P.XX_Forme_ID,
      FM.DESCRIPTION AS FORM
    FROM M_InoutLine il
    INNER JOIN M_Product p ON il.m_product_id=P.M_PRODUCT_ID
    LEFT OUTER JOIN AD_USER UP ON UP.AD_USER_ID = IL.XX_PREPARATEURTR_ID
    LEFT OUTER JOIN AD_USER UC ON UC.AD_USER_ID = IL.XX_CONTROLEURTR_ID
    left outer join XX_Forme FM ON  FM.XX_Forme_ID=P.XX_Forme_ID
    INNER JOIN XX_SalesContext SLC ON SLC.XX_SalesContext_ID=P.XX_SalesContext_ID
    INNER JOIN M_Attributesetinstance asi ON asi.M_ATTRIBUTESETINSTANCE_ID=il.M_ATTRIBUTESETINSTANCE_ID
    LEFT OUTER JOIN M_AttributeInstance aPPA  ON appa.m_attributesetinstance_id = il.m_attributesetinstance_id  AND aPPA.m_attribute_id  = 1000503
    LEFT OUTER JOIN M_AttributeInstance aSHP  ON aSHP.m_attributesetinstance_id = il.m_attributesetinstance_id   AND aSHP.m_attribute_id = 1000506
    LEFT OUTER JOIN M_AttributeInstance fr   ON FR.m_attributesetinstance_id = il.m_attributesetinstance_id  AND FR.m_attribute_id           = 1000508
    LEFT OUTER JOIN C_BPARTNER BP ON BP.C_BPARTNER_ID=fr.VALUENUMBER
    INNER JOIN M_InOutGroupLine ILG  ON IL.M_InOutGroupLine_ID=ILG.M_InOutGroupLine_ID
    INNER JOIN M_InOutGroup IG ON IG.M_InOutGroup_ID=ILG.M_InOutGroup_ID
    INNER JOIN M_Inout I  ON I.M_INOUT_ID=il.M_INOUT_ID
    INNER JOIN C_DocType DOC  ON I.C_DocType_ID=DOC.C_DocType_ID
    INNER JOIN C_Bpartner_Location bpl  ON bpl.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
    INNER JOIN C_SalesRegion SR  ON SR.C_SalesRegion_ID=bpl.C_SALESREGION_ID
    INNER JOIN C_SalesRegionGroupLINE SRG   ON SRG.C_SALESREGION_ID=SR.C_SALESREGION_ID
    INNER JOIN C_SalesRegionGroup GSRG  ON SRG.C_SalesRegionGroup_ID=GSRG.C_SalesRegionGroup_ID
    INNER JOIN m_locator ls  ON ls.M_LOCATOR_ID=il.XX_LOCATORSOURCE_ID
    WHERE i.docstatus           IN ('IP', 'CO', 'CL','DR')
    AND i.issotrx                ='Y'
    AND I.ISRETURNTRX            ='N'
    AND i.XX_ISDEJASERVI         = 'N'
    AND I.ISQR='${query.isQr}'
    AND IG.MOVEMENTDATE ='${query.date}'
    AND SRG.C_SalesRegionGroup_ID IN (${query.groupId})
    AND NOT EXISTS
      (SELECT *
      FROM M_INOUTLINE IL
      INNER JOIN M_INOUT I
      ON IL.M_INOUT_ID=I.M_INOUT_ID
      INNER JOIN C_BPARTNER_LOCATION BPL
      ON BPL.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
      INNER JOIN m_locator ls
      ON ls.M_LOCATOR_ID            =il.XX_LOCATORSOURCE_ID
      WHERE IL.M_INOUTGROUPLINE_ID IS NULL
      AND I.docstatus              IN ('IP','DR')
      AND i.issotrx                 ='Y'
      AND I.ISRETURNTRX             ='N'
      AND i.XX_ISDEJASERVI          = 'N'
      AND BPL.C_SALESREGION_ID     IN
        (SELECT C_SALESREGION_ID
        FROM C_SalesRegionGroupLine
        WHERE C_SalesRegionGroup_ID IN (${query.groupId})
        )
      AND i.MOVEMENTDATE       <='${query.date}'
      AND I.ISQR='${query.isQr}'
      )
      GROUP BY ls.VALUE,
      GSRG.NAME,
      p.NAME,
      P.VERSIONNO,
      SLC.VALUE,
      P.ISCHER,
      P.ISQR,
      aPPA.VALUENUMBER ,
      ASI.LOT,
      asi.GUARANTEEDATE,
      aSHP.VALUENUMBER ,
      BP.NAME ,
      SRG.C_SALESREGIONGROUP_ID,
      ls.m_locator_id,
      p.m_product_id,
      p.XX_ExclueControleLot,
      p.XX_ExclueControlePPA,
      p.XX_ExclueControleDate,
      il.XX_CONTROLEURTR_ID,
      il.XX_PREPARATEURTR_ID,
      UP.NAME,
      UC.NAME,
      P.XX_Forme_ID,
      FM.NAME,FM.DESCRIPTION
    ORDER BY p.NAME,ls.VALUE,FM.DESCRIPTION`;
      const connection = await connect;
      const result = await connection.execute(sql, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT });
      return result.rows;
    } catch (error) {
      console.error("error Existe" + error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }
  //flutter
  static selectProduct(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
        SELECT ls.VALUE AS LOCATORSOURCE,
        ls.m_locator_id,
        GSRG.NAME AS GROUPREGION,
        p.m_product_id,
        p.NAME
        ||'   '
        ||P.VERSIONNO AS NAME,
        CASE
          WHEN SLC.VALUE='Q'
          THEN 'Q'
          ELSE ' '
        END              AS QUOTA,
        P.ISQR           AS QR,
        aPPA.VALUENUMBER AS PPA,
        aSHP.VALUENUMBER AS SHP,
        ASI.LOT,
        TO_CHAR(asi.GUARANTEEDATE)             AS GUARANTEEDATE,
        BP.NAME                                AS Fournisseur,
        SUM(il.MOVEMENTQTY)                    AS MOVEMENTQTY,
        MAX(il.QtyMovemented)                    AS QtyMovemented,
        MAX(il.QtyMovementedCtrl)                    AS QtyMovementedCtrl,
        COALESCE (SRG.C_SALESREGIONGROUP_ID,0) AS C_SALESREGIONGROUP_ID,
        LISTAGG(il.M_InoutLine_ID, ',') WITHIN GROUP (
      ORDER BY ls.VALUE,
        GSRG.NAME,
        p.NAME,
        P.VERSIONNO,
        SLC.VALUE,
        P.ISCHER,
        P.ISQR,
        aPPA.VALUENUMBER ,
        ASI.LOT,
        asi.GUARANTEEDATE,
        aSHP.VALUENUMBER ,
        BP.NAME ,
        SRG.C_SALESREGIONGROUP_ID,
        ls.m_locator_id,
        p.m_product_id,
        il.XX_CONTROLEURTR_ID,
        il.XX_PREPARATEURTR_ID) mInoutlineIdList,
        il.XX_CONTROLEURTR_ID,
        il.XX_PREPARATEURTR_ID,
        P.XX_Forme_ID,
        FM.DESCRIPTION AS FORM
      FROM M_InoutLine il
      INNER JOIN M_Product p ON il.m_product_id=P.M_PRODUCT_ID
      left outer join XX_Forme FM ON  FM.XX_Forme_ID=P.XX_Forme_ID
      INNER JOIN XX_SalesContext SLC ON SLC.XX_SalesContext_ID=P.XX_SalesContext_ID
      INNER JOIN M_Attributesetinstance asi ON asi.M_ATTRIBUTESETINSTANCE_ID=il.M_ATTRIBUTESETINSTANCE_ID
      LEFT OUTER JOIN M_AttributeInstance aPPA  ON appa.m_attributesetinstance_id = il.m_attributesetinstance_id  AND aPPA.m_attribute_id  = 1000503
      LEFT OUTER JOIN M_AttributeInstance aSHP  ON aSHP.m_attributesetinstance_id = il.m_attributesetinstance_id   AND aSHP.m_attribute_id = 1000506
      LEFT OUTER JOIN M_AttributeInstance fr   ON FR.m_attributesetinstance_id = il.m_attributesetinstance_id  AND FR.m_attribute_id           = 1000508
      LEFT OUTER JOIN C_BPARTNER BP ON BP.C_BPARTNER_ID=fr.VALUENUMBER
      INNER JOIN M_InOutGroupLine ILG  ON IL.M_InOutGroupLine_ID=ILG.M_InOutGroupLine_ID
      INNER JOIN M_InOutGroup IG ON IG.M_InOutGroup_ID=ILG.M_InOutGroup_ID
      INNER JOIN M_Inout I  ON I.M_INOUT_ID=il.M_INOUT_ID
      INNER JOIN C_DocType DOC  ON I.C_DocType_ID=DOC.C_DocType_ID
      INNER JOIN C_Bpartner_Location bpl  ON bpl.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
      INNER JOIN C_SalesRegion SR  ON SR.C_SalesRegion_ID=bpl.C_SALESREGION_ID
      INNER JOIN C_SalesRegionGroupLINE SRG   ON SRG.C_SALESREGION_ID=SR.C_SALESREGION_ID
      INNER JOIN C_SalesRegionGroup GSRG  ON SRG.C_SalesRegionGroup_ID=GSRG.C_SalesRegionGroup_ID
      INNER JOIN m_locator ls  ON ls.M_LOCATOR_ID=il.XX_LOCATORSOURCE_ID
      WHERE i.docstatus           IN ('IP', 'CO', 'CL','DR')
      AND i.issotrx                ='Y'
      AND I.ISRETURNTRX            ='N'
      AND i.XX_ISDEJASERVI         = 'N'
      AND IL.MOVEMENTQTY           >0
      AND I.ISQR='${e.isQr}'
      AND IG.MOVEMENTDATE ='${e.date}'
      AND ls.XX_PREPARATEURTR_ID=${e.xxPreparateurTrId}
      AND SRG.C_SalesRegionGroup_ID=${e.groupId}
      AND NOT EXISTS
        (SELECT *
        FROM M_INOUTLINE IL
        INNER JOIN M_INOUT I
        ON IL.M_INOUT_ID=I.M_INOUT_ID
        INNER JOIN C_BPARTNER_LOCATION BPL
        ON BPL.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
        INNER JOIN m_locator ls
        ON ls.M_LOCATOR_ID            =il.XX_LOCATORSOURCE_ID
        WHERE IL.M_INOUTGROUPLINE_ID IS NULL
        AND I.docstatus              IN ('IP','DR')
        AND i.issotrx                 ='Y'
        AND I.ISRETURNTRX             ='N'
        AND i.XX_ISDEJASERVI          = 'N'
        AND IL.MOVEMENTQTY            >0
        AND BPL.C_SALESREGION_ID     IN
          (SELECT C_SALESREGION_ID
          FROM C_SalesRegionGroupLine
          WHERE C_SalesRegionGroup_ID=${e.groupId}
          )
        AND ls.XX_PREPARATEURTR_ID=${e.xxPreparateurTrId}
        AND i.MOVEMENTDATE       <='${e.date}'
        AND I.ISQR='${e.isQr}'
        )
        GROUP BY ls.VALUE,
        GSRG.NAME,
        p.NAME,
        P.VERSIONNO,
        SLC.VALUE,
        P.ISCHER,
        P.ISQR,
        aPPA.VALUENUMBER ,
        ASI.LOT,
        asi.GUARANTEEDATE,
        aSHP.VALUENUMBER ,
        BP.NAME ,
        SRG.C_SALESREGIONGROUP_ID,
        ls.m_locator_id,
        p.m_product_id,
        il.XX_CONTROLEURTR_ID,
        il.XX_PREPARATEURTR_ID,
        P.XX_Forme_ID,
        FM.NAME,FM.DESCRIPTION
      ORDER BY ls.VALUE,FM.DESCRIPTION,
        p.NAME
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

  static selectProductControled(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
     SELECT ls.VALUE AS LOCATORSOURCE,
    ls.m_locator_id,
    GSRG.NAME AS GROUPREGION,
    p.m_product_id,
    p.XX_ExclueControleLot,
    p.XX_ExclueControlePPA,
    p.XX_ExclueControleDate,
    p.NAME
    ||'   '
    ||P.VERSIONNO AS NAME,
    CASE
      WHEN SLC.VALUE='Q'
      THEN 'Q'
      ELSE ' '
    END              AS QUOTA,
    P.ISQR           AS QR,
    aPPA.VALUENUMBER AS PPA,
    aSHP.VALUENUMBER AS SHP,
    ASI.LOT,
    TO_CHAR(asi.GUARANTEEDATE)             AS GUARANTEEDATE,
    BP.NAME                                AS Fournisseur,
    SUM(il.MOVEMENTQTY)                    AS MOVEMENTQTY,
    MAX(il.QtyMovemented)                    AS QtyMovemented,
    MAX(il.QtyMovementedCtrl)                    AS QtyMovementedCtrl,
    COALESCE (SRG.C_SALESREGIONGROUP_ID,0) AS C_SALESREGIONGROUP_ID,
    LISTAGG(il.M_InoutLine_ID, ',') WITHIN GROUP (
  ORDER BY ls.VALUE,
    GSRG.NAME,
    p.NAME,
    P.VERSIONNO,
    SLC.VALUE,
    P.ISCHER,
    P.ISQR,
    aPPA.VALUENUMBER ,
    ASI.LOT,
    asi.GUARANTEEDATE,
    aSHP.VALUENUMBER ,
    BP.NAME ,
    SRG.C_SALESREGIONGROUP_ID,
    ls.m_locator_id,
    p.m_product_id,
    p.XX_ExclueControleLot,
    p.XX_ExclueControlePPA,
    p.XX_ExclueControleDate,
    il.XX_CONTROLEURTR_ID,
    il.XX_PREPARATEURTR_ID) mInoutlineIdList,
    il.XX_CONTROLEURTR_ID,
    il.XX_PREPARATEURTR_ID,
    P.XX_Forme_ID,
    FM.DESCRIPTION AS FORM
  FROM M_InoutLine il
  INNER JOIN M_Product p ON il.m_product_id=P.M_PRODUCT_ID
  left outer join XX_Forme FM ON  FM.XX_Forme_ID=P.XX_Forme_ID
  INNER JOIN XX_SalesContext SLC ON SLC.XX_SalesContext_ID=P.XX_SalesContext_ID
  INNER JOIN M_Attributesetinstance asi ON asi.M_ATTRIBUTESETINSTANCE_ID=il.M_ATTRIBUTESETINSTANCE_ID
  LEFT OUTER JOIN M_AttributeInstance aPPA  ON appa.m_attributesetinstance_id = il.m_attributesetinstance_id  AND aPPA.m_attribute_id  = 1000503
  LEFT OUTER JOIN M_AttributeInstance aSHP  ON aSHP.m_attributesetinstance_id = il.m_attributesetinstance_id   AND aSHP.m_attribute_id = 1000506
  LEFT OUTER JOIN M_AttributeInstance fr   ON FR.m_attributesetinstance_id = il.m_attributesetinstance_id  AND FR.m_attribute_id           = 1000508
  LEFT OUTER JOIN C_BPARTNER BP ON BP.C_BPARTNER_ID=fr.VALUENUMBER
  INNER JOIN M_InOutGroupLine ILG  ON IL.M_InOutGroupLine_ID=ILG.M_InOutGroupLine_ID
  INNER JOIN M_InOutGroup IG ON IG.M_InOutGroup_ID=ILG.M_InOutGroup_ID
  INNER JOIN M_Inout I  ON I.M_INOUT_ID=il.M_INOUT_ID
  INNER JOIN C_DocType DOC  ON I.C_DocType_ID=DOC.C_DocType_ID
  INNER JOIN C_Bpartner_Location bpl  ON bpl.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
  INNER JOIN C_SalesRegion SR  ON SR.C_SalesRegion_ID=bpl.C_SALESREGION_ID
  INNER JOIN C_SalesRegionGroupLINE SRG   ON SRG.C_SALESREGION_ID=SR.C_SALESREGION_ID
  INNER JOIN C_SalesRegionGroup GSRG  ON SRG.C_SalesRegionGroup_ID=GSRG.C_SalesRegionGroup_ID
  INNER JOIN m_locator ls  ON ls.M_LOCATOR_ID=il.XX_LOCATORSOURCE_ID
  WHERE i.docstatus           IN ('IP', 'CO', 'CL','DR')
  AND i.issotrx                ='Y'
  AND I.ISRETURNTRX            ='N'
  AND i.XX_ISDEJASERVI         = 'N'
  AND IL.MOVEMENTQTY           >0
  AND I.ISQR='${e.isQr}'
  AND IG.MOVEMENTDATE ='${e.date}'
  AND ls.XX_CONTROLEURTR_ID=${e.xxPreparateurTrId}
  AND SRG.C_SalesRegionGroup_ID=${e.groupId}
  AND NOT EXISTS
    (SELECT *
    FROM M_INOUTLINE IL
    INNER JOIN M_INOUT I
    ON IL.M_INOUT_ID=I.M_INOUT_ID
    INNER JOIN C_BPARTNER_LOCATION BPL
    ON BPL.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
    INNER JOIN m_locator ls
    ON ls.M_LOCATOR_ID            =il.XX_LOCATORSOURCE_ID
    WHERE IL.M_INOUTGROUPLINE_ID IS NULL
    AND I.docstatus              IN ('IP','DR')
    AND i.issotrx                 ='Y'
    AND I.ISRETURNTRX             ='N'
    AND i.XX_ISDEJASERVI          = 'N'
    AND IL.MOVEMENTQTY            >0
    AND BPL.C_SALESREGION_ID     IN
      (SELECT C_SALESREGION_ID
      FROM C_SalesRegionGroupLine
      WHERE C_SalesRegionGroup_ID=${e.groupId}
      )
    AND ls.XX_CONTROLEURTR_ID=${e.xxPreparateurTrId}
    AND i.MOVEMENTDATE       <='${e.date}'
    AND I.ISQR='${e.isQr}'
    )
    GROUP BY ls.VALUE,
    GSRG.NAME,
    p.NAME,
    P.VERSIONNO,
    SLC.VALUE,
    P.ISCHER,
    P.ISQR,
    aPPA.VALUENUMBER ,
    ASI.LOT,
    asi.GUARANTEEDATE,
    aSHP.VALUENUMBER ,
    BP.NAME ,
    SRG.C_SALESREGIONGROUP_ID,
    ls.m_locator_id,
    p.m_product_id,
    p.XX_ExclueControleLot,
    p.XX_ExclueControlePPA,
    p.XX_ExclueControleDate,
    il.XX_CONTROLEURTR_ID,
    il.XX_PREPARATEURTR_ID,
    P.XX_Forme_ID,
    FM.NAME,FM.DESCRIPTION
  ORDER BY ls.VALUE,FM.DESCRIPTION,
    p.NAME
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

  static selectProductEmpl(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
    SELECT ls.VALUE AS LOCATORSOURCE,
    ls.m_locator_id,
    GSRG.NAME AS GROUPREGION,
    p.m_product_id,
    p.NAME
    ||'   '
    ||P.VERSIONNO AS NAME,
    CASE
      WHEN SLC.VALUE='Q'
      THEN 'Q'
      ELSE ' '
    END              AS QUOTA,
    P.ISQR           AS QR,
    aPPA.VALUENUMBER AS PPA,
    aSHP.VALUENUMBER AS SHP,
    ASI.LOT,
    TO_CHAR(asi.GUARANTEEDATE)             AS GUARANTEEDATE,
    BP.NAME                                AS Fournisseur,
    SUM(il.MOVEMENTQTY)                    AS MOVEMENTQTY,
    MAX(il.QtyMovemented)                    AS QtyMovemented,
    MAX(il.QtyMovementedCtrl)                    AS QtyMovementedCtrl,
    COALESCE (SRG.C_SALESREGIONGROUP_ID,0) AS C_SALESREGIONGROUP_ID,
    LISTAGG(il.M_InoutLine_ID, ',') WITHIN GROUP (
  ORDER BY ls.VALUE,
    GSRG.NAME,
    p.NAME,
    P.VERSIONNO,
    SLC.VALUE,
    P.ISCHER,
    P.ISQR,
    aPPA.VALUENUMBER ,
    ASI.LOT,
    asi.GUARANTEEDATE,
    aSHP.VALUENUMBER ,
    BP.NAME ,
    SRG.C_SALESREGIONGROUP_ID,
    ls.m_locator_id,
    p.m_product_id,
    il.XX_CONTROLEURTR_ID,
    il.XX_PREPARATEURTR_ID) mInoutlineIdList,
    il.XX_CONTROLEURTR_ID,
    il.XX_PREPARATEURTR_ID,
    P.XX_Forme_ID,
    FM.DESCRIPTION AS FORM
  FROM M_InoutLine il
  INNER JOIN M_Product p ON il.m_product_id=P.M_PRODUCT_ID
  left outer join XX_Forme FM ON  FM.XX_Forme_ID=P.XX_Forme_ID
  INNER JOIN XX_SalesContext SLC ON SLC.XX_SalesContext_ID=P.XX_SalesContext_ID
  INNER JOIN M_Attributesetinstance asi ON asi.M_ATTRIBUTESETINSTANCE_ID=il.M_ATTRIBUTESETINSTANCE_ID
  LEFT OUTER JOIN M_AttributeInstance aPPA  ON appa.m_attributesetinstance_id = il.m_attributesetinstance_id  AND aPPA.m_attribute_id  = 1000503
  LEFT OUTER JOIN M_AttributeInstance aSHP  ON aSHP.m_attributesetinstance_id = il.m_attributesetinstance_id   AND aSHP.m_attribute_id = 1000506
  LEFT OUTER JOIN M_AttributeInstance fr   ON FR.m_attributesetinstance_id = il.m_attributesetinstance_id  AND FR.m_attribute_id           = 1000508
  LEFT OUTER JOIN C_BPARTNER BP ON BP.C_BPARTNER_ID=fr.VALUENUMBER
  INNER JOIN M_InOutGroupLine ILG  ON IL.M_InOutGroupLine_ID=ILG.M_InOutGroupLine_ID
  INNER JOIN M_InOutGroup IG ON IG.M_InOutGroup_ID=ILG.M_InOutGroup_ID
  INNER JOIN M_Inout I  ON I.M_INOUT_ID=il.M_INOUT_ID
  INNER JOIN C_DocType DOC  ON I.C_DocType_ID=DOC.C_DocType_ID
  INNER JOIN C_Bpartner_Location bpl  ON bpl.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
  INNER JOIN C_SalesRegion SR  ON SR.C_SalesRegion_ID=bpl.C_SALESREGION_ID
  INNER JOIN C_SalesRegionGroupLINE SRG   ON SRG.C_SALESREGION_ID=SR.C_SALESREGION_ID
  INNER JOIN C_SalesRegionGroup GSRG  ON SRG.C_SalesRegionGroup_ID=GSRG.C_SalesRegionGroup_ID
  INNER JOIN m_locator ls  ON ls.M_LOCATOR_ID=il.XX_LOCATORSOURCE_ID
  WHERE i.docstatus           IN ('IP', 'CO', 'CL','DR')
  AND i.issotrx                ='Y'
  AND I.ISRETURNTRX            ='N'
  AND i.XX_ISDEJASERVI         = 'N'
  AND IL.MOVEMENTQTY           >0
  AND I.ISQR='${e.isQr}'
  AND IG.MOVEMENTDATE ='${e.date}'
  AND ls.M_Locator_ID=${e.empl}
  AND SRG.C_SalesRegionGroup_ID=${e.groupId}
  AND NOT EXISTS
    (SELECT *
    FROM M_INOUTLINE IL
    INNER JOIN M_INOUT I
    ON IL.M_INOUT_ID=I.M_INOUT_ID
    INNER JOIN C_BPARTNER_LOCATION BPL
    ON BPL.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
    INNER JOIN m_locator ls
    ON ls.M_LOCATOR_ID            =il.XX_LOCATORSOURCE_ID
    WHERE IL.M_INOUTGROUPLINE_ID IS NULL
    AND I.docstatus              IN ('IP','DR')
    AND i.issotrx                 ='Y'
    AND I.ISRETURNTRX             ='N'
    AND i.XX_ISDEJASERVI          = 'N'
    AND IL.MOVEMENTQTY            >0
    AND BPL.C_SALESREGION_ID     IN
      (SELECT C_SALESREGION_ID
      FROM C_SalesRegionGroupLine
      WHERE C_SalesRegionGroup_ID=${e.groupId}
      )
    AND ls.M_Locator_ID=${e.empl}
    AND i.MOVEMENTDATE       <='${e.date}'
    AND I.ISQR='${e.isQr}'
    )
    GROUP BY ls.VALUE,
    GSRG.NAME,
    p.NAME,
    P.VERSIONNO,
    SLC.VALUE,
    P.ISCHER,
    P.ISQR,
    aPPA.VALUENUMBER ,
    ASI.LOT,
    asi.GUARANTEEDATE,
    aSHP.VALUENUMBER ,
    BP.NAME ,
    SRG.C_SALESREGIONGROUP_ID,
    ls.m_locator_id,
    p.m_product_id,
    il.XX_CONTROLEURTR_ID,
    il.XX_PREPARATEURTR_ID,
    P.XX_Forme_ID,
    FM.NAME,FM.DESCRIPTION
  ORDER BY ls.VALUE,FM.DESCRIPTION,
    p.NAME
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

  // AND ls.XX_PREPARATEURTR_ID=${e.xxPreparateurTrId}
  static transferRequest(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `select ${e.variable} from TRK_EASY_TRANSFER where
               ${e.value} `
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
  static programme(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(` select ${e.select} from  XX_ProgrammeJour ${e.where} `)
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
  static updateMinoutLine(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(` ${e} `)
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
  static selectProductToDt(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
              SELECT ls.VALUE AS LOCATORSOURCE,
    ls.m_locator_id,
    GSRG.NAME AS GROUPREGION,
    p.m_product_id,
    p.XX_ExclueControleLot,
    p.XX_ExclueControlePPA,
    p.XX_ExclueControleDate,
    p.NAME
    ||'   '
    ||P.VERSIONNO AS NAME,
    CASE
      WHEN SLC.VALUE='Q'
      THEN 'Q'
      ELSE ' '
    END              AS QUOTA,
    P.ISQR           AS QR,
    aPPA.VALUENUMBER AS PPA,
    aSHP.VALUENUMBER AS SHP,
    ASI.LOT,
    TO_CHAR(asi.GUARANTEEDATE)             AS GUARANTEEDATE,
    BP.NAME                                AS Fournisseur,
    SUM(il.MOVEMENTQTY)                    AS MOVEMENTQTY,
    SUM(il.Orig_QtyEntered)                    AS OrigQtyEntered,
    MAX(il.QtyMovemented)                    AS QtyMovemented,
    MAX(il.QtyMovementedCtrl)                    AS QtyMovementedCtrl,
    COALESCE (SRG.C_SALESREGIONGROUP_ID,0) AS C_SALESREGIONGROUP_ID,
    LISTAGG(il.M_InoutLine_ID, ',') WITHIN GROUP (
  ORDER BY ls.VALUE,
    GSRG.NAME,
    p.NAME,
    P.VERSIONNO,
    SLC.VALUE,
    P.ISCHER,
    P.ISQR,
    aPPA.VALUENUMBER ,
    ASI.LOT,
    asi.GUARANTEEDATE,
    aSHP.VALUENUMBER ,
    BP.NAME ,
    SRG.C_SALESREGIONGROUP_ID,
    ls.m_locator_id,
    p.m_product_id,
    p.XX_ExclueControleLot,
    p.XX_ExclueControlePPA,
    p.XX_ExclueControleDate,
    il.XX_CONTROLEURTR_ID,
    il.XX_PREPARATEURTR_ID) mInoutlineIdList,
    il.XX_CONTROLEURTR_ID,
    il.XX_PREPARATEURTR_ID,
    P.XX_Forme_ID,
    FM.DESCRIPTION AS FORM
  FROM M_InoutLine il
  INNER JOIN M_Product p ON il.m_product_id=P.M_PRODUCT_ID
  left outer join XX_Forme FM ON  FM.XX_Forme_ID=P.XX_Forme_ID
  INNER JOIN XX_SalesContext SLC ON SLC.XX_SalesContext_ID=P.XX_SalesContext_ID
  INNER JOIN M_Attributesetinstance asi ON asi.M_ATTRIBUTESETINSTANCE_ID=il.M_ATTRIBUTESETINSTANCE_ID
  LEFT OUTER JOIN M_AttributeInstance aPPA  ON appa.m_attributesetinstance_id = il.m_attributesetinstance_id  AND aPPA.m_attribute_id  = 1000503
  LEFT OUTER JOIN M_AttributeInstance aSHP  ON aSHP.m_attributesetinstance_id = il.m_attributesetinstance_id   AND aSHP.m_attribute_id = 1000506
  LEFT OUTER JOIN M_AttributeInstance fr   ON FR.m_attributesetinstance_id = il.m_attributesetinstance_id  AND FR.m_attribute_id           = 1000508
  LEFT OUTER JOIN C_BPARTNER BP ON BP.C_BPARTNER_ID=fr.VALUENUMBER
  INNER JOIN M_InOutGroupLine ILG  ON IL.M_InOutGroupLine_ID=ILG.M_InOutGroupLine_ID
  INNER JOIN M_InOutGroup IG ON IG.M_InOutGroup_ID=ILG.M_InOutGroup_ID
  INNER JOIN M_Inout I  ON I.M_INOUT_ID=il.M_INOUT_ID
  INNER JOIN C_DocType DOC  ON I.C_DocType_ID=DOC.C_DocType_ID
  INNER JOIN C_Bpartner_Location bpl  ON bpl.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
  INNER JOIN C_SalesRegion SR  ON SR.C_SalesRegion_ID=bpl.C_SALESREGION_ID
  INNER JOIN C_SalesRegionGroupLINE SRG   ON SRG.C_SALESREGION_ID=SR.C_SALESREGION_ID
  INNER JOIN C_SalesRegionGroup GSRG  ON SRG.C_SalesRegionGroup_ID=GSRG.C_SalesRegionGroup_ID
  INNER JOIN m_locator ls  ON ls.M_LOCATOR_ID=il.XX_LOCATORSOURCE_ID
  WHERE i.docstatus           IN ('IP', 'CO', 'CL','DR')
  AND i.issotrx                ='Y'
  AND I.ISRETURNTRX            ='N'
  AND i.XX_ISDEJASERVI         = 'N'
  AND IL.MOVEMENTQTY           >0
  AND IG.MOVEMENTDATE ='${e.date}'
  AND SRG.C_SalesRegionGroup_ID=${e.groupId}
  AND NOT EXISTS
    (SELECT *
    FROM M_INOUTLINE IL
    INNER JOIN M_INOUT I
    ON IL.M_INOUT_ID=I.M_INOUT_ID
    INNER JOIN C_BPARTNER_LOCATION BPL
    ON BPL.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
    INNER JOIN m_locator ls
    ON ls.M_LOCATOR_ID            =il.XX_LOCATORSOURCE_ID
    WHERE IL.M_INOUTGROUPLINE_ID IS NULL
    AND I.docstatus              IN ('IP','DR')
    AND i.issotrx                 ='Y'
    AND I.ISRETURNTRX             ='N'
    AND i.XX_ISDEJASERVI          = 'N'
    AND IL.MOVEMENTQTY            >0
    AND BPL.C_SALESREGION_ID     IN
      (SELECT C_SALESREGION_ID
      FROM C_SalesRegionGroupLine
      WHERE C_SalesRegionGroup_ID=${e.groupId}
      )
    AND i.MOVEMENTDATE       <='${e.date}'
    )
    GROUP BY ls.VALUE,
    GSRG.NAME,
    p.NAME,
    P.VERSIONNO,
    SLC.VALUE,
    P.ISCHER,
    P.ISQR,
    aPPA.VALUENUMBER ,
    ASI.LOT,
    asi.GUARANTEEDATE,
    aSHP.VALUENUMBER ,
    BP.NAME ,
    SRG.C_SALESREGIONGROUP_ID,
    ls.m_locator_id,
    p.m_product_id,
    p.XX_ExclueControleLot,
    p.XX_ExclueControlePPA,
    p.XX_ExclueControleDate,
    il.XX_CONTROLEURTR_ID,
    il.XX_PREPARATEURTR_ID,
    P.XX_Forme_ID,
    FM.NAME,FM.DESCRIPTION
  ORDER BY ls.VALUE,FM.DESCRIPTION,
    p.NAME
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

  static selectProductByIsQR(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
            SELECT ls.VALUE AS LOCATORSOURCE,
        ls.m_locator_id,
        'ALL' AS GROUPREGION,
        p.m_product_id,
        p.NAME
        ||'   '
        ||P.VERSIONNO AS NAME,
        CASE
          WHEN SLC.VALUE='Q'
          THEN 'Q'
          ELSE ' '
        END              AS QUOTA,
        P.ISQR           AS QR,
        aPPA.VALUENUMBER AS PPA,
        aSHP.VALUENUMBER AS SHP,
        ASI.LOT,
        TO_CHAR(asi.GUARANTEEDATE)             AS GUARANTEEDATE,
        BP.NAME                                AS Fournisseur,
        SUM(il.MOVEMENTQTY)                    AS MOVEMENTQTY,
        MAX(il.QtyMovemented)                    AS QtyMovemented,
        MAX(il.QtyMovementedCtrl)                    AS QtyMovementedCtrl,
        0 AS C_SALESREGIONGROUP_ID,
        LISTAGG(il.M_InoutLine_ID, ',') WITHIN GROUP (
      ORDER BY ls.VALUE,
        p.NAME,
        P.VERSIONNO,
        SLC.VALUE,
        P.ISCHER,
        P.ISQR,
        aPPA.VALUENUMBER ,
        ASI.LOT,
        asi.GUARANTEEDATE,
        aSHP.VALUENUMBER ,
        BP.NAME ,
        ls.m_locator_id,
        p.m_product_id,
        il.XX_CONTROLEURTR_ID,
        il.XX_PREPARATEURTR_ID) mInoutlineIdList,
        il.XX_CONTROLEURTR_ID,
        il.XX_PREPARATEURTR_ID,
        P.XX_Forme_ID,
        FM.DESCRIPTION AS FORM
      FROM M_InoutLine il
      INNER JOIN M_Product p ON il.m_product_id=P.M_PRODUCT_ID
      left outer join XX_Forme FM ON  FM.XX_Forme_ID=P.XX_Forme_ID
      INNER JOIN XX_SalesContext SLC ON SLC.XX_SalesContext_ID=P.XX_SalesContext_ID
      INNER JOIN M_Attributesetinstance asi ON asi.M_ATTRIBUTESETINSTANCE_ID=il.M_ATTRIBUTESETINSTANCE_ID
      LEFT OUTER JOIN M_AttributeInstance aPPA  ON appa.m_attributesetinstance_id = il.m_attributesetinstance_id  AND aPPA.m_attribute_id  = 1000503
      LEFT OUTER JOIN M_AttributeInstance aSHP  ON aSHP.m_attributesetinstance_id = il.m_attributesetinstance_id   AND aSHP.m_attribute_id = 1000506
      LEFT OUTER JOIN M_AttributeInstance fr   ON FR.m_attributesetinstance_id = il.m_attributesetinstance_id  AND FR.m_attribute_id  = 1000508
      LEFT OUTER JOIN C_BPARTNER BP ON BP.C_BPARTNER_ID=fr.VALUENUMBER
      INNER JOIN M_InOutGroupLine ILG  ON IL.M_InOutGroupLine_ID=ILG.M_InOutGroupLine_ID
      INNER JOIN M_InOutGroup IG ON IG.M_InOutGroup_ID=ILG.M_InOutGroup_ID
      INNER JOIN M_Inout I  ON I.M_INOUT_ID=il.M_INOUT_ID
      INNER JOIN C_DocType DOC  ON I.C_DocType_ID=DOC.C_DocType_ID
      INNER JOIN C_Bpartner_Location bpl  ON bpl.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
      INNER JOIN C_SalesRegion SR  ON SR.C_SalesRegion_ID=bpl.C_SALESREGION_ID
      INNER JOIN m_locator ls  ON ls.M_LOCATOR_ID=il.XX_LOCATORSOURCE_ID
      WHERE i.docstatus           IN ('IP', 'CO', 'CL','DR')
      AND i.issotrx                ='Y'
      AND I.ISRETURNTRX            ='N'
      AND i.XX_ISDEJASERVI         = 'N'
      AND IL.MOVEMENTQTY           >0
      AND I.ISQR= '${e.isQr}'
      AND IG.MOVEMENTDATE = '${e.date}'
      AND ls.XX_PREPARATEURTR_ID=${e.userSelected}
        GROUP BY ls.VALUE,
        p.NAME,
        P.VERSIONNO,
        SLC.VALUE,
        P.ISCHER,
        P.ISQR,
        aPPA.VALUENUMBER ,
        ASI.LOT,
        asi.GUARANTEEDATE,
        aSHP.VALUENUMBER ,
        BP.NAME ,
        ls.m_locator_id,
        p.m_product_id,
        il.XX_CONTROLEURTR_ID,
        il.XX_PREPARATEURTR_ID,
        P.XX_Forme_ID,
        FM.NAME,FM.DESCRIPTION
      ORDER BY ls.VALUE,FM.DESCRIPTION,
        p.NAME
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

  static selectProductByIsQRN(e, cb) {
    connect
      .then(function (conn) {
        return conn
          .execute(
            `
              SELECT ls.VALUE AS LOCATORSOURCE,
       ls.m_locator_id,
        'ALL' AS GROUPREGION,
        p.m_product_id,
        p.NAME   ||'   '    ||P.VERSIONNO AS NAME,
        CASE
          WHEN SLC.VALUE='Q'
          THEN 'Q'
          ELSE ' '
        END              AS QUOTA,
        P.ISQR           AS QR,
        aPPA.VALUENUMBER AS PPA,
        aSHP.VALUENUMBER AS SHP,
        ASI.LOT,
        TO_CHAR(asi.GUARANTEEDATE)             AS GUARANTEEDATE,
        BP.NAME                                AS Fournisseur,
        SUM(il.MOVEMENTQTY)                    AS MOVEMENTQTY,
        MAX(il.QtyMovemented)                    AS QtyMovemented,
        MAX(il.QtyMovementedCtrl)                    AS QtyMovementedCtrl,
        0 AS C_SALESREGIONGROUP_ID,
        LISTAGG(il.M_InoutLine_ID, ',') WITHIN GROUP (
      ORDER BY ls.VALUE,
        p.NAME,
        P.VERSIONNO,
        SLC.VALUE,
        P.ISCHER,
        P.ISQR,
        aPPA.VALUENUMBER ,
        ASI.LOT,
        asi.GUARANTEEDATE,
        aSHP.VALUENUMBER ,
        BP.NAME ,
        ls.m_locator_id,
        p.m_product_id,
        il.XX_CONTROLEURTR_ID,
        il.XX_PREPARATEURTR_ID) mInoutlineIdList,
        il.XX_CONTROLEURTR_ID,
        il.XX_PREPARATEURTR_ID,
        P.XX_Forme_ID,
        FM.DESCRIPTION AS FORM
      FROM M_InoutLine il
      INNER JOIN M_Product p ON il.m_product_id=P.M_PRODUCT_ID
      left outer join XX_Forme FM ON  FM.XX_Forme_ID=P.XX_Forme_ID
      INNER JOIN XX_SalesContext SLC ON SLC.XX_SalesContext_ID=P.XX_SalesContext_ID
      INNER JOIN M_Attributesetinstance asi ON asi.M_ATTRIBUTESETINSTANCE_ID=il.M_ATTRIBUTESETINSTANCE_ID
      LEFT OUTER JOIN M_AttributeInstance aPPA  ON appa.m_attributesetinstance_id = il.m_attributesetinstance_id  AND aPPA.m_attribute_id  = 1000503
      LEFT OUTER JOIN M_AttributeInstance aSHP  ON aSHP.m_attributesetinstance_id = il.m_attributesetinstance_id   AND aSHP.m_attribute_id = 1000506
      LEFT OUTER JOIN M_AttributeInstance fr   ON FR.m_attributesetinstance_id = il.m_attributesetinstance_id  AND FR.m_attribute_id  = 1000508
      LEFT OUTER JOIN C_BPARTNER BP ON BP.C_BPARTNER_ID=fr.VALUENUMBER
      INNER JOIN M_InOutGroupLine ILG  ON IL.M_InOutGroupLine_ID=ILG.M_InOutGroupLine_ID
      INNER JOIN M_InOutGroup IG ON IG.M_InOutGroup_ID=ILG.M_InOutGroup_ID
      INNER JOIN M_Inout I  ON I.M_INOUT_ID=il.M_INOUT_ID
      INNER JOIN C_DocType DOC  ON I.C_DocType_ID=DOC.C_DocType_ID
      INNER JOIN C_Bpartner_Location bpl  ON bpl.C_BPARTNER_LOCATION_ID=I.C_BPARTNER_LOCATION_ID
      INNER JOIN C_SalesRegion SR  ON SR.C_SalesRegion_ID=bpl.C_SALESREGION_ID
      INNER JOIN m_locator ls  ON ls.M_LOCATOR_ID=il.XX_LOCATORSOURCE_ID
      WHERE i.docstatus           IN ('IP', 'CO', 'CL','DR')
      AND i.issotrx                ='Y'
      AND I.ISRETURNTRX            ='N'
      AND i.XX_ISDEJASERVI         = 'N'
      AND IL.MOVEMENTQTY           >0
      AND I.ISQR= '${e.isQr}'
      AND IG.MOVEMENTDATE = '${e.date}'
      AND ls.XX_PREPARATEURTR_ID=${e.userSelected} 
      AND (bpl.C_SALESREGION_ID in (select C_SALESREGION_ID from C_SalesRegionGroupLine where C_SalesRegionGroup_ID= ${e.groupId} ) or ${e.groupId} is null)
        GROUP BY ls.VALUE,
        p.NAME,
        P.VERSIONNO,
        SLC.VALUE,
        P.ISCHER,
        P.ISQR,
        aPPA.VALUENUMBER ,
        ASI.LOT,
        asi.GUARANTEEDATE,
        aSHP.VALUENUMBER ,
        BP.NAME ,
        ls.m_locator_id,
        p.m_product_id,
        il.XX_CONTROLEURTR_ID,
        il.XX_PREPARATEURTR_ID,
        P.XX_Forme_ID,
        FM.NAME,FM.DESCRIPTION
      ORDER BY ls.VALUE,FM.DESCRIPTION,
        p.NAME `,
            {},
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
          )
          .then(function (result) {
            cb(result.rows);
            console.log(result.rows.length);
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

module.exports = tabTransfer;
