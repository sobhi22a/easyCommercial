const connectSql = require('../config/dbSql')

class tabParametre {
    constructor(row){
        this.row=row
    }

     static insert (sql,cb){
        connectSql.query(`${sql}`,(err,result)=>{
            cb(result)
        })
    }
    static select (sql,cb){
        connectSql.query(`${sql}`,(err,result)=>{
            cb(result)
        })
    }

    static reference (cb){
        connectSql.query('select req_quota_ref from parametre',(err,reference)=>{
            cb(reference)
        })
    }

    static updateReference(cb){
        connectSql.query('update parametre set req_quota_ref=req_quota_ref+1 where idparametre=1',(err,result)=>{
            cb(result)
        })
    }
}

module.exports=tabParametre