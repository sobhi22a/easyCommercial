const connect = require('../../../config/dbSql')

class TabInventaireProduitsMysql{
    constructor(row){
        this.row = row
    }

    static insert(e) {
        return new Promise((resolve, reject) => {
            connect.query(`insert into inventaireproduits 
                set ad_user_id=?,userName=?,
                m_product_id=?,name=?,createdBy=?`,
            [e.ad_user_id,e.userName,e.m_product_id,e.name,e.createdBy],(err,result)=>{
                if(err) throw err.message
                resolve(result)
            })
        })
    }

    static modifyIsFinished(e) {
        return new Promise((resolve, reject) => {
            connect.query(`update inventaireproduits 
                set isFinished='${e.isFinished}', modifyBy='${e.modifyBy}' 
                where id=${e.id}`,(err,result)=>{
                if(err) reject(err.message)
                resolve(result)
            })
        })
    }

    static deleteLineInventory(e) {
        return new Promise((resolve, reject) => {
            connect.query(`delete from inventaireproduits where id=${e.id}`,(err,result)=>{
                if(err) reject(err.message)
                resolve(result)
            })
        })
    }

    static delete(e){
        return new Promise((resole, reject) => {
            connect.query(`${e}`,(err, result)=>{
                if(err) throw err.message
                resole(result)
        })
        })
    }

    static update(e){
        return new Promise((resole, reject) => {
            connect.query(`${e}`,(err, result)=>{
                if(err) throw err.message
                resole(result)
        })
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

module.exports = TabInventaireProduitsMysql;