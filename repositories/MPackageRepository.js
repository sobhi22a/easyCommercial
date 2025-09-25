const { QueryTypes } = require('sequelize');
const oracle = require('../config/oracle/oracledb');
module.exports.FindPackageWitgID = async (m_package_id) => {
  try {
    var sql = `select * from M_Package where M_Package_ID=${m_package_id}`
      return await oracle.sequelize.query(sql, { type: QueryTypes.SELECT });
    } catch (error) {
        console.error(error);
    };
};

module.exports.InsertPackageReturn = async (package,userID) => {
  try {
    var sql = `insert into M_Package 
    (M_PACKAGE_ID,AD_CLIENT_ID,AD_ORG_ID,CREATEDBY,DOCUMENTNO,M_INOUT_ID,DESCRIPTION,M_SHIPPER_ID,TRACKINGINFO,DATERECEIVED,RECEIVEDINFO,
        PROCESSED,ISPRINTED,XX_VOIDED,XX_ARRIVAL,XX_CHARGED,R_REQUEST_ID,XX_SHIPPER_ID,XX_FORWADED,DD_VEHICLE_ID,XX_BPARTNERSHIPPER_ID,
        XX_DELIVERED,ISDELIVERED,ISDISPATCHED,ISLOADED,DATEDELIVERED,DATELOADED,DATEDISPACHED,XX_EXPEDITEUR_ID)
    VALUES 
    (AD_SEQUENCE_NEXTNO('M_Package'),${1000000},${package.AD_ORG_ID},${userID},'${package.DOCUMENTNO}/1',${package.M_INOUT_ID},
    '${package.DESCRIPTION}',${package.M_SHIPPER_ID},${null},${null},${null},'N','N','N','N','N',${null},${null},'N',${null},${null},
    'N','N','N','N',${null},${null},${null},${null})`;
      var result = await oracle.sequelize.query(sql, { type: QueryTypes.INSERT });
      return result[1];
    } catch (error) {
        console.error(error);
    };
};