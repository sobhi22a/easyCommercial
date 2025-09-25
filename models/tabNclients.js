
var connect = require('../config/dbSql')

class tabNclient{
    constructor(row){
        this.row=row
    }
    static select (e,cb){
        let indice = e.indice
        switch(indice){
            case 0:
                connect.query('select * from nclients where  valide=? OR valide=? '
                ,['S','R'],(err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
            case 1:
                connect.query('select * from nclients where idClient=?',[e.idClient],(err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
            case 2:
                connect.query('select ad_org,idClient,nomClient,wilaya,valide from nclients where operateur=?',[e.operateur],(err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
            case 3:
                connect.query('select * from nclients where valide=? and ad_org=? '
                ,[e.valide,e.ad_org],(err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
            case 4:
                connect.query(`select * from nclients where
                 ${e.clause}`,
                (err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
        }
    }
    static insert (e){
        connect.query('insert into nclients set ad_org=?,operateur=?,nomClient=?,nTel1=?,nTel2=?,adresse1=?,wilaya=?,rc=?,nif=?,ai=?,bl=?,fact=?,para=?,dateCreation=?',[e.id_org,e.indiceOper,e.nomClient,e.nTel1,e.nTel2,e.adresse1,e.wilaya,e.rc,e.nif,e.ai,e.bl,e.fact,e.para,e.dateCreation])
    }
    static update (e){
        let indice = e.indice;
        switch(indice){
            case 1:
                connect.query('update nclients set mdp=?, valide=? , svr=?,region=?,dateSVR=? where idClient=?'
                ,[e.mdp,e.valide,e.indiceOper,e.region,e.dateSVR,e.idClient])
            break;
            case 2:
                connect.query('update nclients set svc=?, valide=?,dateSVC=? where idClient=?',[e.svc,e.valide,e.dateSVC,e.idClient])
            break;
            case 3:
                connect.query('update nclients set valide=?,dateContentieux=? where idClient=?',[e.valide,e.dateContentieux,e.idClient])
            break;
        }
    }
    static delete (e,cb){
        let indice = e.indice;
        switch(indice){
            case 1:
                connect.query('delete from nclients where idClient=? and valide IN ("N","S")',[e.idClient],(err,result)=>{
                    cb(result.affectedRows)
                })
            break;
        }
    }
}
module.exports=tabNclient