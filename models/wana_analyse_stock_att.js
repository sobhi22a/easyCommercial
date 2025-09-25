
var connect = require('../config/db')

class tabWanaAnalyseStockAtt{
    constructor(row){
        this.row=row
    }

static select (e,cb){
  let indice = e.indice
  switch(indice){
    case 1:
      connect.then(function(conn) {
        return conn.execute(
         " select count(m_product_id) as nbr from m_product  "+
         " where  xx_soumiapprobation='Y' and  M_Product_Category_ID<>1000658 "         
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
    break;
    case 2:
      connect.then(function(conn) {
        return conn.execute(
         " select m_product_id from m_product "+
         " where  xx_soumiapprobation='Y' and  M_Product_Category_ID<>1000658 "         
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
    break;
  }
}
static bomQty(e,cb){
  connect.then(function(conn) {
    return conn.execute(
      " select BOMQTYAVAILABLEBYLOCATORSHARE "+
      " (:m_product_id,1000000)" +
      " as qts from dual "
       ,{m_product_id:e.m_product_id} 
    )
    .then(function(result) {
     cb(result.rows)
     //console.log(result.rowsAffected);
   })
   .catch(function(err) {
    console.error(err);
  });
})
 .catch(function(err) {
   console.error(err);
}); 
}


static insert(e,cb){
  connect.then(function(conn) {
   return conn.execute(
    "insert into xx_quota (ad_org_id,ad_client_id,m_product_id,ad_user_id,QUANTITY,PERCENTAGE,QTYORDERED,QTYALLOCATED,xx_quota_id,createdby) "+
    " values "+
    " (:ad_org_id,1000000,:m_product_id,:ad_user_id,:quantity,:percentage,:qtyordered,0,AD_SEQUENCE_NEXTNO('XX_Quota'),:createdby)",
     {
      ad_org_id:e.ad_org_id,
      m_product_id:e.m_product_id,
      ad_user_id:null,
      quantity:e.quantity,
      createdby:e.ad_user_id,
      qtyordered:e.qtyordered,
      percentage: e.percentage === null ? 0 : e.percentage,
     }  
    ).then(function(result) {
      cb(result.rowsAffected)
       // console.log(result.rowsAffected);
      })
    .catch(function(err) {
     console.error(err);
   });
 })
  .catch(function(err) {
    console.error(err);
 })
}
static selectProduct(cb){
  connect.then(function(conn) {
    return conn.execute(
      ` SELECT sc.value,p.m_product_id,BOMQTYAVAILABLEBYLOCATORSHARE(p.m_product_id,1000000) as qty                                                                                                                                           FROM M_Product p
      inner join XX_SalesContext sc on sc.XX_SalesContext_ID=p.XX_SalesContext_ID
      WHERE sc.value='Q' order by qty desc `
    )
    .then(function(result) {
     cb(result.rows)
     //console.log(result.rowsAffected);
   })
   .catch(function(err) {
    console.error(err);
  });
})
 .catch(function(err) {
   console.error(err);
}); 
}




static delete(cb){
  connect.then(function(conn) {
   return conn.execute(
    " delete from xx_quota ",
    ).then(function(result) {
      cb(result.rowsAffected)
       // console.log(result.rowsAffected);
      })
    .catch(function(err) {
     console.error(err);
   });
 })
  .catch(function(err) {
    console.error(err);
 })
}

static select1(e,cb){
  connect.then(function(conn) {
      return conn.execute(
       `
       select ${e.select}
       from c_order o
       inner join c_orderline ol on o.c_order_id=ol.c_order_id
       inner join m_product p on p.m_product_id=ol.m_product_id
       inner join ad_user adu on adu.ad_user_id=o.SALESREP_ID
       inner join c_bpartner bp on bp.c_bpartner_id=o.c_bpartner_id
       ${e.where}
       `
       )
       .then(function(result) {
         var data = JSON.stringify(result.rows)
         cb(result.rows)
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
module.exports=tabWanaAnalyseStockAtt