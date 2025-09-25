var connect = require('../../config/db')

class tabTiers{
    constructor(row){
        this.row=row
    }

    static update(e,cb){
      connect.then(function(conn) {
          return conn.execute(
            "update C_BPartner set XX_SEQORDEREXP=:classification where C_BPartner_ID=:id"
            ,{classification:e.classification,id:e.id_cbpartner_id}
          )
          .then(function(result) {
           cb(result)
           //console.log(result.rows);
         })
         .catch(function(err) {
          console.error(err);
        });
      })
       .catch(function(err) {
         console.error(err);
    });
  }
  static select(e,cb){
    connect.then(function(conn) {
        return conn.execute(
          ` select TRK_LOCATION_BP (${e}) from dual `
        )
        .then(function(result) {
         cb(result.rows)
         //console.log(result.rows);
       })
       .catch(function(err) {
        console.error(err);
      });
    })
     .catch(function(err) {
       console.error(err);
  });
}
}
module.exports=tabTiers