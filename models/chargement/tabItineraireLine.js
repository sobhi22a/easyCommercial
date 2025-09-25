const connect = require('../../config/dbSql')

class tabItinerairesLine {
    constructor(row){
        this.row=row
    }

    static insert (e,cb){
        connect.query("insert into itinerairesline set idItineraire=?,c_bpartner_id=? ,classification=?",
        [e.idItineraire,e.c_bpartner_id,e.classification],
        (err,result)=>{
            if(err) throw err
            cb(result)
        })
    }

    static select (e,cb){
        let indice = e.indice
        switch(indice){
            case 1:
                connect.query("select * from itinerairesline where idItineraire=? ",
                [e.idItineraire],(err,result)=>{
                    if(err) throw err
                    cb(result)
                })
            break;
        }
    }

    static delete(e,cb){
        let indice = e.indice;
        switch(indice){
            case 1:
                connect.query('delete from itinerairesline where idItineraire=? AND c_bpartner_id=?',
                [e.idItineraire,e.c_bpartner_id],(err,result)=>{
                    if (err) throw err
                    cb(result)
                })
            break;
        }
    }
}


module.exports=tabItinerairesLine 