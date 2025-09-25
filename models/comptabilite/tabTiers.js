var connect = require('../../config/db')

class tabTiers{
    constructor(row){
        this.row=row
    }

  static select(cb){
    connect.then(function(conn) {
        return conn.execute(
          ` select  C_BPARTNER_ID,NAME from C_BPartner where C_BP_Group_ID IN (1001124,1000625) and isactive='Y' `
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