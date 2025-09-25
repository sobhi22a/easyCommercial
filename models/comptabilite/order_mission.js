var connect = require('../../config/db')

class order_mission{
    constructor(row){
        this.row=row
    }

static select(e,cb){
    let indice = e.indice
    switch(indice){
        case 1:
            connect.then(function(conn) {
                return conn.execute(
                ` SELECT 1000000 AS AD_ORG_ID,
                org.name     AS org,
                br.processed,
                br.XX_BONROUTE_ID,
                br.DOCUMENTNO,
                br.DATEREPORT,
                lv.NAME        AS livreur,
                tr.C_BPARTNER_ID        AS id_transporteur,
                tr.name        AS transporteur,
                vb.NAME        AS vehiculemarque,
                tv.NAME        AS vehiculetype,
                v.REGISTRATION AS Plaque,
                v.YEAR,
                LEP.NAME                                AS NOM,
                LEP.NAME2                               AS PRENOM,
                DR.NAME                                 AS NOMCH,
                DR.NAME2                                AS PRENOMCH,
                J.NAME                                  AS JOB,
                HD.NAME                                 AS DEPARTEMENT,
                TRK_BON_ROUTE_DEST(BR.XX_BonRoute_ID)   AS DESTINATION,
                TRK_REGION_BON_ROUTE(BR.XX_BonRoute_ID) AS region,
                br.XX_DAYNUMBER,
                TO_CHAR(br.STARTDATE) as StarDate,
                br.ENDDATE,
                br.DESCRIPTION,
                SUM(m.VOLUME)                               AS co,
                SUM(m.WEIGHT)                               AS cv,
                SUM(m.XX_CO_CH)                             AS co_ch,
                SUM(m.XX_CV_CH)                             AS cv_ch,
                SUM (m.XX_SACHET)                           AS schet,
                SUM(m.XX_SACHET_CH)                         AS sachet_ch,
                SUM(m.XX_BAG)                               AS bac ,
                SUM (m.XX_BAC_CH)                           AS bac_ch,
                SUM(m.VOLUME+m.WEIGHT+m.XX_CO_CH+m.XX_CV_CH)AS total_colis,
                br.AMT,
                br.MONTANTGAZ,
                br.MONTANTLOYER
              FROM XX_BonRouteLine brl
              INNER JOIN m_inout m
              ON m.m_inout_id=brl.m_inout_id
              INNER JOIN C_Bpartner_Location bpl
              ON bpl.C_BPARTNER_LOCATION_ID=m.C_BPARTNER_LOCATION_ID
              INNER JOIN C_SalesRegion SR
              ON SR.C_SalesRegion_ID=bpl.C_SALESREGION_ID
              INNER JOIN C_SalesRegionGroupLINE SRG
              ON SRG.C_SALESREGION_ID=SR.C_SALESREGION_ID
              INNER JOIN C_SalesRegionGroup GSRG
              ON SRG.C_SalesRegionGroup_ID=GSRG.C_SalesRegionGroup_ID
              INNER JOIN C_BPartner_Location bpl
              ON bpl.C_BPartner_Location_id=m.C_BPartner_Location_id
              INNER JOIN ad_org org
              ON m.ad_org_id=org.ad_org_id
              INNER JOIN XX_BonRoute br
              ON br.XX_BONROUTE_ID=brl.XX_BONROUTE_ID
              LEFT OUTER JOIN c_bpartner lv
              ON lv.C_BPARTNER_ID=br.XX_SHIPPER_ID
              LEFT OUTER JOIN HR_Employee LEP
              ON LEP.C_BPARTNER_ID=LV.C_BPARTNER_ID
              LEFT OUTER JOIN HR_Job J
              ON J.HR_Job_ID=LEP.HR_Job_ID
              LEFT OUTER JOIN HR_Department HD
              ON HD.HR_Department_ID=LEP.HR_Department_ID
              LEFT OUTER JOIN c_bpartner tr
              ON tr.C_BPARTNER_ID=br.XX_BPARTNERSHIPPER_ID
              LEFT OUTER JOIN DD_Vehicle v
              ON v.DD_VEHICLE_ID=br.DD_VEHICLE_ID
              LEFT OUTER JOIN DD_Driver DR
              ON tr.C_BPARTNER_ID=DR.C_BPARTNER_ID
              LEFT OUTER JOIN DD_Brand vb
              ON vb.DD_BRAND_ID=v.DD_BRAND_ID
              LEFT OUTER JOIN DD_VehicleType tv
              ON tv.DD_VEHICLETYPE_ID  =v.DD_VEHICLETYPE_ID
              WHERE
              tr.C_Bpartner_ID =${e.c_bpartner_id}
              AND br.processed='Y'
              and br.ISPAID='N'
              GROUP BY br.AD_ORG_ID,
                org.name,
                tr.C_BPARTNER_ID ,
                br.processed,
                br.XX_BONROUTE_ID,
                br.DOCUMENTNO,
                DATEREPORT,
                lv.NAME,
                tr.name,
                vb.NAME,
                tv.NAME,
                v.REGISTRATION,
                YEAR,
                LEP.NAME,
                LEP.NAME2,
                DR.NAME,
                DR.NAME2,
                J.NAME,
                HD.NAME,
                br.XX_DAYNUMBER,
                br.STARTDATE,
                br.ENDDATE,
                br.AMT,
                br.MONTANTGAZ,
                br.MONTANTLOYER,
                br.DESCRIPTION
              ORDER BY lv.name,
                TR.NAME,
                br.STARTDATE,
                BR.AD_ORG_ID
                        `
                      )
                      .then(function(result) {
                       cb(result.rows)
                       //console.log(result.rows);
                     })
                     .catch(function(err) {
                      console.error(err);
                    });
                  })
                   .catch(function(err) {
                     console.error(err);
                });
        break;
        case 2:
            connect.then(function(conn) {
                return conn.execute(
                ` SELECT 1000000 AS AD_ORG_ID,
                org.name     AS org,
                br.processed,
                br.XX_BONROUTE_ID,
                br.DOCUMENTNO,
                br.DATEREPORT,
                lv.NAME        AS livreur,
                tr.C_BPARTNER_ID        AS id_transporteur,
                tr.name        AS transporteur,
                vb.NAME        AS vehiculemarque,
                tv.NAME        AS vehiculetype,
                v.REGISTRATION AS Plaque,
                v.YEAR,
                LEP.NAME                                AS NOM,
                LEP.NAME2                               AS PRENOM,
                DR.NAME                                 AS NOMCH,
                DR.NAME2                                AS PRENOMCH,
                J.NAME                                  AS JOB,
                HD.NAME                                 AS DEPARTEMENT,
                TRK_BON_ROUTE_DEST(BR.XX_BonRoute_ID)   AS DESTINATION,
                TRK_REGION_BON_ROUTE(BR.XX_BonRoute_ID) AS region,
                br.XX_DAYNUMBER,
                TO_CHAR(br.STARTDATE) as StarDate,
                br.ENDDATE,
                br.DESCRIPTION,
                SUM(m.VOLUME)                               AS co,
                SUM(m.WEIGHT)                               AS cv,
                SUM(m.XX_CO_CH)                             AS co_ch,
                SUM(m.XX_CV_CH)                             AS cv_ch,
                SUM (m.XX_SACHET)                           AS schet,
                SUM(m.XX_SACHET_CH)                         AS sachet_ch,
                SUM(m.XX_BAG)                               AS bac ,
                SUM (m.XX_BAC_CH)                           AS bac_ch,
                SUM(m.VOLUME+m.WEIGHT+m.XX_CO_CH+m.XX_CV_CH)AS total_colis,
                br.AMT,
                br.MONTANTGAZ,
                br.MONTANTLOYER
              FROM XX_BonRouteLine brl
              INNER JOIN m_inout m
              ON m.m_inout_id=brl.m_inout_id
              INNER JOIN C_Bpartner_Location bpl
              ON bpl.C_BPARTNER_LOCATION_ID=m.C_BPARTNER_LOCATION_ID
              INNER JOIN C_SalesRegion SR
              ON SR.C_SalesRegion_ID=bpl.C_SALESREGION_ID
              INNER JOIN C_SalesRegionGroupLINE SRG
              ON SRG.C_SALESREGION_ID=SR.C_SALESREGION_ID
              INNER JOIN C_SalesRegionGroup GSRG
              ON SRG.C_SalesRegionGroup_ID=GSRG.C_SalesRegionGroup_ID
              INNER JOIN C_BPartner_Location bpl
              ON bpl.C_BPartner_Location_id=m.C_BPartner_Location_id
              INNER JOIN ad_org org
              ON m.ad_org_id=org.ad_org_id
              INNER JOIN XX_BonRoute br
              ON br.XX_BONROUTE_ID=brl.XX_BONROUTE_ID
              LEFT OUTER JOIN c_bpartner lv
              ON lv.C_BPARTNER_ID=br.XX_SHIPPER_ID
              LEFT OUTER JOIN HR_Employee LEP
              ON LEP.C_BPARTNER_ID=LV.C_BPARTNER_ID
              LEFT OUTER JOIN HR_Job J
              ON J.HR_Job_ID=LEP.HR_Job_ID
              LEFT OUTER JOIN HR_Department HD
              ON HD.HR_Department_ID=LEP.HR_Department_ID
              LEFT OUTER JOIN c_bpartner tr
              ON tr.C_BPARTNER_ID=br.XX_BPARTNERSHIPPER_ID
              LEFT OUTER JOIN DD_Vehicle v
              ON v.DD_VEHICLE_ID=br.DD_VEHICLE_ID
              LEFT OUTER JOIN DD_Driver DR
              ON tr.C_BPARTNER_ID=DR.C_BPARTNER_ID
              LEFT OUTER JOIN DD_Brand vb
              ON vb.DD_BRAND_ID=v.DD_BRAND_ID
              LEFT OUTER JOIN DD_VehicleType tv
              ON tv.DD_VEHICLETYPE_ID  = v.DD_VEHICLETYPE_ID
              WHERE TRUNC (DATEREPORT) >= '${e.date1}'
              AND TRUNC (DATEREPORT)  <= '${e.date2}'
              AND tr.C_Bpartner_ID = ${e.c_bpartner_id}
              AND br.processed='Y'
              and br.ISPAID='N'
              GROUP BY br.AD_ORG_ID,
                org.name,
                tr.C_BPARTNER_ID ,
                br.processed,
                br.XX_BONROUTE_ID,
                br.DOCUMENTNO,
                DATEREPORT,
                lv.NAME,
                tr.name,
                vb.NAME,
                tv.NAME,
                v.REGISTRATION,
                YEAR,
                LEP.NAME,
                LEP.NAME2,
                DR.NAME,
                DR.NAME2,
                J.NAME,
                HD.NAME,
                br.XX_DAYNUMBER,
                br.STARTDATE,
                br.ENDDATE,
                br.AMT,
                br.MONTANTGAZ,
                br.MONTANTLOYER,
                br.DESCRIPTION
              ORDER BY lv.name,
                TR.NAME,
                br.STARTDATE,
                BR.AD_ORG_ID
                        `
                      )
                      .then(function(result) {
                       cb(result.rows)
                       //console.log(result.rows);
                     })
                     .catch(function(err) {
                      console.error(err);
                    });
                  })
                   .catch(function(err) {
                     console.error(err);
                });
        break;
        case 3 :
          connect.then(function(conn) {
            return conn.execute(
              " select max(xx_rowid)+1 from R_Request "
            )
            .then(function(result) {
             cb(result.rows)
             //console.log(result.rows);
           })
           .catch(function(err) {
            console.error(err);
          });
        })
         .catch(function(err) {
           console.error(err);
      });
        break;
        case 4 :
          connect.then(function(conn) {
            return conn.execute(
              " select R_Request_ID from R_Request  where xx_rowid=:xx_rowId",
              {xx_rowId:e.xx_rowId}
            )
            .then(function(result) {
             cb(result.rows)
             //console.log(result.rows);
           })
           .catch(function(err) {
            console.error(err);
          });
        })
         .catch(function(err) {
           console.error(err);
      });
        break;
    }

}
}
module.exports=order_mission