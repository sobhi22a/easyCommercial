var connect = require('../../config/db')

class xx_bonroute{
    constructor(row){
        this.row=row
    }

  static update(e,cb){
    connect.then(function(conn) {
        return conn.execute(
          ` update xx_bonroute set ispaid='Y',r_request_id=${e.r_request_id} 
          where xx_bonroute_id in ${e.bonRoute} `
        )
        .then(function(result) {
         cb(result.rowsAffected)
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
static updateProcessed(e,cb){
  connect.then(function(conn) {
      return conn.execute(
        ` update ${e.set} ${e.where} `
      )
      .then(function(result) {
       cb(result.rowsAffected)
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
module.exports=xx_bonroute