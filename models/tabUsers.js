var connect = require('../config/dbSql')

class tabUsers{
    constructor(row){
        this.row=row
    }

    static selectIsBlocked(e)
    {
        return new Promise((resolve,reject)=>{
            connect.query('select bloque from users where ad_user_id=? and bloque=?',[e.ad_user_id, e.bloque],(err,result)=>{
                if(err) reject(err)
                resolve(result)
            })
        })
    }
    static findByOne(e,cb){
        var indice = e.indice
        switch(indice){
            case 203:
                connect.query('select * from users where indice=? and mdp=?',[e.indice1,e.mdp],(err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
            case 10204:
                connect.query('select indice from users where indice=? and mdp=? and role=?',[e.indiceSVC,e.mdp,e.role],(err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
            case 8:
                connect.query('select * from users where id_dc=? and bloque=?',
                [e.id_dc,e.bloque],(err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
            case 2:
                connect.query('select * from users where indice=?',
                [e.indiceOper],(err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
            case 0:
                connect.query('select * from users where role=1 and id_dc=0 and ad_org_id!=0',
                (err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
            case 102:
                connect.query('select * from users',
                (err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
        }
    }


    static update (e,cb){
        let indice = e.indice
        switch(indice){
            case 8:
                connect.query('update users set bloque=? where id_dc=?',[e.bloque,e.id_dc],(err,result)=>{
                    if(err) throw err.message
                    cb(result.affectedRows)
                })
            break;
        }
    }

    static updateBloqueOper(e) {
        return new Promise((resolve, reject) => {
            connect.query('update users set bloque=? where id_dc=?',[e.bloque,e.id_dc],(err,result)=>{
                if(err) reject(err);
                resolve(result.affectedRows)
            })
        });
    }
    static select (e,cb){
        connect.query(`${e}`,(err,result)=>{
            if(err) throw err
            cb(result)
        })
    }

}


module.exports=tabUsers