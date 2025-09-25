var connect = require('../../config/dbSql')

class tabTransfertMysql{
    constructor(row){
        this.row=row
    }

    static insert(sql,cb){
      connect.query(`${sql}`,(err,result)=>{
         if(err) throw err
         cb(result);
      })
    }

    static select(sql,cb){
        connect.query(`${sql}`,(err,result)=>{
            if(err) throw err
            cb(result)
        })
    }

    static delete(sql,cb){
        connect.query(`${sql}`,(err,result)=>{
            if(err) throw err
            cb(result)
        })
    }

    static update(sql,cb){
        connect.query(`${sql}`,(err,result)=>{
            if(err) throw err
            cb(result)
        })
    }
}

module.exports=tabTransfertMysql