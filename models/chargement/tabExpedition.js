var connect = require('../../config/db')

class tabExpedition{
    constructor(row){
        this.row=row
    }

    static select(region,clients,cb){
      connect.then(function(conn) {
          return conn.execute(
            `select * from TRK_EASY_EXPEDITION where 
            "c_salesregion_id"= ${region} and C_BPARTNER_ID not in ${clients}` 
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
  static select1(region,cb){
    connect.then(function(conn) {
        return conn.execute(
          ` select * from TRK_EASY_EXPEDITION where 
          "c_salesregion_id"= ${region} ` 
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
  
  static selectWithClinets(e,cb){
    connect.then(function(conn) {
        return conn.execute(
          ` SELECT bpl.C_salesregion_id,sg.name as region , i.C_BPARTNER_ID,bp.name,bp.value, 
            XX_SEQORDEREXP,sum(i.WEIGHT) as co ,sum(i.VOLUME) as cv ,sum(i.XX_SACHET) as sachet , 
            sum(i.XX_BAG) as bag from m_inout i 
            inner join c_bpartner bp on i.C_BPARTNER_ID=bp.C_BPARTNER_ID 
            inner join c_bpartner_location bpl on bpl.C_BPARTNER_LOCATION_ID=i.C_BPARTNER_LOCATION_ID
            left outer join c_salesregion sg on sg.C_SALESREGION_ID=bpl.C_SALESREGION_ID 
            where m_inout_id in 
            (select m_inout_id from m_inoutline il inner join c_orderline ol 
            on il.c_orderline_id=ol.c_orderline_id 
            where il.movementqty>0 and il.isinvoiced='N' and ol.QTYDELIVERED<>ol.QTYINVOICED)
            AND I.DOCSTATUS IN ('CO','CL','IP','DR') and i.ISSOTRX='Y' and i.ISRETURNTRX='N' 
            and i.XX_ISDEJASERVI='N' 
            and bpl.C_SALESREGION_ID = ${e.region}
            and i.C_BPARTNER_ID in ${e.clients}
            group by bpl.C_salesregion_id,sg.name, i.C_BPARTNER_ID,bp.name,bp.value,bp.XX_SEQORDEREXP 
            order by bp.XX_SEQORDEREXP `          
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
module.exports=tabExpedition