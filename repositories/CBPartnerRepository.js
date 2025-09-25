const { QueryTypes } = require('sequelize');
const oracle = require('../config/oracle/oracledb');

module.exports = class CPBartnerRepository {
    static async UpdateClientToVenteGelee(data) {
        try {
            const sql = `Update C_BP_Share SET 
                        SALESREP_ID=1085134,
                        xx_TempSalesRep_id = ${data.tempSalesRep} 
                    WHERE ad_org_id=${data.adOrgId} AND c_bpartner_id=${data.cBPartnerId}`;
              return await oracle.sequelize.query(sql, { type: QueryTypes.UPDATE });
            } catch (error) {
                console.error(error);
            };
    }
}