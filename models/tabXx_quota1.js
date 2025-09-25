const connect = require('../config/dbSql')

class tabXx_quota1{
    constructor(row){
        this.row = row
    }

    static insert(e,cb){
        connect.query("insert into xx_quota set ad_client_id=1000000,ad_org_id=?,created=?,createdby=?,isactive='Y',updated=?,updatedby=0,xx_quota_id=?,m_product_id=?,ad_user_id=?,quantity=?,percentage=?,qtyordered=?,m_warehouse_id=null,description=null,reference=?,qtyallocated=?,qtyentered=?,c_bpartner_id=?,name=?",
        [e.ad_org_id,e.created,e.createdby,e.updated,e.xx_quota_id,e.m_product_id,null,0,0,0,e.reference,e.qtyallocated,0,e.c_bpartner_id,e.name],(err,result)=>{
            if(err) throw err.message
            cb(result)
        })
    }

    static delete(e,cb){
        connect.query(`delete from xx_quota ${e.where} `,(err,result)=>{
            if(err) throw err.message
            cb(result)
        })
    }

    static deleteXxQuota(e) {
        return new Promise((resolve, reject) => {
          connect.query(`delete from xx_quota ${e.where}`, (err, result) => {
            if (err) {
              reject(err.message);
            } else {
              resolve(result);
            }
          });
        });
      }

      static deleteLineXxQuotaByReferenceAndProduct(m_product_id, reference) {
        return new Promise((resolve, reject) => {
          connect.query(`delete from xx_quota where m_product_id=${m_product_id} 
            and reference=${reference}`, (err, result) => {
            if (err) {
              reject(err.message);
            } else {
              resolve(result);
            }
          });
        });
      }

    static update(e){
        return new Promise((resole, reject) => {
            connect.query(`${e}`,(err, result)=>{
                if(err) throw err.message
                resole(result)
        })
        })
    }

    static updateFeature(e,cb){
        connect.query(` ${e} `,(err,result)=>{
            if(err) throw err.message
            cb(result.affectedRows)
        })
    }
    static select(e){
        return new Promise((resolve, reject) => {
            try {
              connect.query(`${e}`,(err,result)=>{
                if(err) throw err.message;
                resolve(result);
              })
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports=tabXx_quota1