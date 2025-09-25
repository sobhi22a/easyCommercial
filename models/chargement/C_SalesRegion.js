var connect = require('../../config/db')

class C_SalesRegion{
    constructor(row){
        this.row=row
    }

    static select(cb){
      connect.then(function(conn) {
          return conn.execute(
          //  "select c_order_id,documentno, DATEORDERED from c_order WHERE AD_User_ID=1047108 AND DATEORDERED=:da",{da:d}
            "select C_SALESREGION_ID,name from C_SalesRegion where isactive='Y'"
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
module.exports=C_SalesRegion