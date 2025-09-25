const { QueryTypes } = require('sequelize');
const oracle = require('../config/oracle/oracledb');

module.exports = class AdUserRepository {
    static async GetListUserInventory() {
        try {
            let sql = `SELECT au.ad_user_id, au.name from ad_user au
                    inner join AD_User_Roles aur on aur.ad_user_id=au.ad_user_id
                    where AD_Role_ID=1002352 and au.isactive = 'Y'`;
              return await oracle.sequelize.query(sql, { type: QueryTypes.SELECT });
            } catch (error) {
                console.error(error);
            };
    }

    static async getUserName(ad_user_id) {
        try {
            let sql = `SELECT name from ad_user where ad_user_id=${ad_user_id} and isactive = 'Y'`;
              var result = await oracle.sequelize.query(sql, { type: QueryTypes.SELECT });
              return result[0].NAME;
            } catch (error) {
                console.error(error);
            };
    }
}