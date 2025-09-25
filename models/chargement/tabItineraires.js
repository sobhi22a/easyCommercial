const connect = require('../../config/dbSql')

class tabItineraires {
    constructor(row){
        this.row=row
    }

    static insert (e,cb){
        connect.query("insert into itineraires set idCreated=? , createdBy=? , "+
        " dateCreation=?, timeCreation=? ",[e.idCreated,e.createdBy,e.dateCreation,e.timeCreation],
        (err,result)=>{
            if(err) throw err
            cb(result.insertId)
        })
    }

    static select (e,cb){
        let indice = e.indice
        switch(indice){
            case 1:
                connect.query("select * from itineraires where idCreated=? and dateCreation=?",
                [e.idCreated,e.dateCreation],(err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
        }
    }
    static update (e,cb){
        let indice = e.indice
        switch(indice){
            case 1:
                connect.query("update itineraires set compteur=? where idItineraire=? ",
                [e.compteur,e.idItineraire,],(err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
        }
    }
}


module.exports=tabItineraires