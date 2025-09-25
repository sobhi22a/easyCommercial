const { QueryTypes } = require('sequelize');
const OracleDB = require('oracledb');
const oracle = require('../config/oracle/oracledb');
let connect = require('../config/db');

module.exports = class XxQuotaRepository {
    static async GetExistProductInReferenceAsync(reference, m_product_id) {
        try {
            let sql = `select count(*) as numberOfLines from Xx_Quota 
                where reference = '${reference}' 
                and m_product_id = ${m_product_id}`;
              let result = await oracle.sequelize.query(sql, { type: QueryTypes.SELECT });
              return result[0].NUMBEROFLINES; 
            } catch (error) {
                console.error(error);
            };
    }

    static async GetListProductById(xx_quota_id) {
      let sql = `select q.xx_quota_id,mp.name,q.qtyallocated,q.m_product_id,q.quantity,q.updatedby,q.reference from xx_quota q
                  inner join m_product mp 
                  on q.m_product_id=mp.m_product_id
                  where q.xx_quota_id=${xx_quota_id}`;
      let result = await oracle.sequelize.query(sql, {type: QueryTypes.SELECT});
      if(result.length == 0) return null;
      return result[0];
    }

    static async ReservationCounterAsync(ad_user_id, m_product_id) {
        try {
            let sql = `SELECT * FROM xx_quota WHERE createdby=${ad_user_id} AND quantity=0 AND m_product_id=${m_product_id}`;
              return await oracle.sequelize.query(sql, { type: QueryTypes.SELECT });
            } catch (error) {
                console.error(error);
            };
    }

    static async ModifyProductQuotaBySVAsync(qtyOrdered, id_dc, xx_quota_id) {
      try {
          let sql = `update xx_quota 
                set quantity=${qtyOrdered},
                updatedby=${id_dc} 
              where xx_quota_id=${xx_quota_id}`;
            return await oracle.sequelize.query(sql, { type: QueryTypes.UPDATE });
          } catch (error) {
              console.error(error);
          };
    } 

    static async ModifyAllProductQuotaBySVAsync(reference, id_dc) {
      try {
          let sql = `update xx_quota set quantity=qtyallocated, updatedby=${id_dc}
                where reference='${reference}' and updatedby=${0}`;
            return await oracle.sequelize.query(sql, { type: QueryTypes.UPDATE });
          } catch (error) {
              console.error(error);
          };
    } 

    static async DeleteProductAsync(reference, m_product_id) {
      try {
          let sql = `delete from xx_quota where reference='${reference}' and m_product_id=${m_product_id}`;
            let result = await oracle.sequelize.query(sql);
            return result[0].rowsAffected;
          } catch (error) {
              console.error(error);
          };
    } 

    static ManageQuantiyXxQuotaAsync(Qty, IdDc, MProductId) {
        return new Promise((resolve, reject) => {
            const plsql = `
                DECLARE
                    v_result NUMBER;
                BEGIN
                    v_result := COMPIERE.AD_MANAGE_QUANTITY_XXQUOTA(:Qty, :IdDc, :MProductId);
                    :result := v_result;
                END;
            `;
    
            const binds = {
                Qty: { val: parseInt(Qty), type: OracleDB.NUMBER },
                IdDc: { val: parseInt(IdDc), type: OracleDB.NUMBER },
                MProductId: { val: parseInt(MProductId), type: OracleDB.NUMBER },
                result: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }
            };
    
            connect.then(conn => {
                return conn.execute(plsql, binds);
            })
            .then(result => {
                resolve(result.outBinds.result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

    static InsertXxQuotaAsync(e) {
        return new Promise((resolve, reject) => {
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
                resolve(result.rowsAffected);
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
}
