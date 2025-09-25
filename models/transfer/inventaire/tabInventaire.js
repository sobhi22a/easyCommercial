const OracleDB = require('oracledb');
var connect = require('../../../config/db')

class TabInventaire{
    constructor(row){
        this.row=row
    }
    static selectProductByLikeName(name) {
      return new Promise((resolve, reject) => {
        connect.then(function(conn) {
          return conn.execute(
            `select distinct ms.M_PRODUCT_ID, mp.name from M_storage ms
              inner join M_LOCATOR ml on ml.m_locator_id = ms.m_locator_id
              inner join m_product mp on mp.m_product_id = ms.m_product_id
              inner join M_ATTRIBUTESETINSTANCE matt on matt.M_ATTRIBUTESETINSTANCE_ID = ms.M_ATTRIBUTESETINSTANCE_ID -- lot date
              inner join M_ATTRIBUTEINSTANCE ppa on ppa.M_ATTRIBUTESETINSTANCE_ID = ms.M_ATTRIBUTESETINSTANCE_ID and ppa.M_ATTRIBUTE_ID = 1000503
              where name LIKE '%${name.toUpperCase()}%'`
            ,{},{outFormat: OracleDB.OUT_FORMAT_OBJECT}
            )
          .then(function(result) {
            resolve(result.rows)
           //console.log(result.rows);
         })
         .catch(function(err) {
          console.error(err);
        });
      })
       .catch(function(err) {
         console.error(err);
     });
      })
    }

    static selectDetailProductById(m_product_id) {
      return new Promise((resolve, reject) => {
        connect.then(function(conn) {
          return conn.execute(
            `select ms.M_PRODUCT_ID, mp.name, ml.value, ms.M_LOCATOR_ID, matt.LOT, to_char(matt.GUARANTEEDATE) GUARANTEEDATE, ppa.VALUENUMBER, SUM(ms.QTYONHAND) QTYONHAND 
              from M_storage ms
              inner join M_LOCATOR ml on ml.m_locator_id = ms.m_locator_id
              inner join m_product mp on mp.m_product_id = ms.m_product_id
              inner join M_ATTRIBUTESETINSTANCE matt on matt.M_ATTRIBUTESETINSTANCE_ID = ms.M_ATTRIBUTESETINSTANCE_ID
              inner join M_ATTRIBUTEINSTANCE ppa on ppa.M_ATTRIBUTESETINSTANCE_ID = ms.M_ATTRIBUTESETINSTANCE_ID and ppa.M_ATTRIBUTE_ID = 1000503
              where ms.M_PRODUCT_ID = ${m_product_id} and  ms.QTYONHAND > 0 and ml.ISAVAILABLEFORALLOCATION = 'Y'
              group by ms.M_PRODUCT_ID, mp.name, ml.value, ms.M_LOCATOR_ID, matt.LOT, matt.GUARANTEEDATE, ppa.VALUENUMBER
              order by mp.name,ml.value`
            ,{},{outFormat: OracleDB.OUT_FORMAT_OBJECT}
            )
          .then(function(result) {
            resolve(result.rows)
         })
         .catch(function(err) {
          console.error(err);
        });
      })
       .catch(function(err) {
         console.error(err);
     });
      })
    }
    static select(sql,cb){
        connect.then(function(conn) {
            return conn.execute(
              ` ${sql} `,{},{outFormat: OracleDB.OUT_FORMAT_OBJECT}
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

module.exports = TabInventaire;