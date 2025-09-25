const connect = require('../config/dbSql')

class tabConditions {
    constructor(row){
        this.row=row
    }
    static insert(e,cb){
        connect.query("insert into conditions set m_product_id=?,name=?,requette=?,message=?,compteur=?,isactive=?,createdby=?,indice=?,qtymax=?",
        [e.m_product_id,e.name,e.requette,e.message,1,"Y",1032294,"DJALIL",e.qtyMax],(err,result)=>{
            if(err) throw err.message
            cb(result)
        })
    }

    static select (e,cb){
        connect.query(` select ${e.select} from conditions ${e.where} `,(err,result)=>{
            if(err) throw err
            cb(result)
        })
    }

    static async selectAllConditions() {
        return new Promise((resolve, reject) => {
            connect.query(`select * from conditions`, async (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static selectAny (sql) {
        return new Promise((resolve, reject) => {
            connect.query(`${sql}`,(err,result)=>{
                if(err) reject (err)
                resolve(result)
            })
        })
    }
    
    static update (e,cb){
        connect.query(`${e} `,(err,result)=>{
            if(err) throw err
            cb(result)
        })
    }

    static delete1 (e, cb){
        connect.query(`${e}`, (err, result) => {
            if(err) throw err;
            cb(result)
        })
    }
    static async selectFeature(e) {
        return new Promise((resolve, reject) => {
            connect.query(`${e}`, async (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    static async delete(e) {
    return new Promise((resolve, reject) => {
        connect.query(`${e}`, async (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

static selectIfProductExist (m_product_id) {
    return new Promise((resolve, reject) => {
        connect.query(`select * from conditions where m_product_id = ${m_product_id} and isactive = 'Y'`,(err,result)=>{
            if(err) reject (err)
            resolve(result)
        })
    })
}
    
}
module.exports=tabConditions