var connect = require('../../config/db');
const OracleDB = require('oracledb');

class trk_payment_req{
    constructor(row){
        this.row=row
    }

  static insertPayment(e,cb){
    // console.log(e)
    connect.then(function(conn) {
        return conn.execute(
        `Insert into R_REQUEST
          (R_REQUEST_ID, AD_CLIENT_ID, AD_ORG_ID, ISACTIVE,  
            CREATEDBY,  DOCUMENTNO, REQUESTAMT, 
            PRIORITY, DUETYPE, SUMMARY, 
            C_BPARTNER_ID,
            NEXTACTION,  PROCESSED, R_REQUESTTYPE_ID, 
            SALESREP_ID, ISSELFSERVICE,
            AD_ROLE_ID,  CONFIDENTIALTYPE, CONFIDENTIALTYPEENTRY, 
            PRIORITYUSER, QTYINVOICED, QTYSPENT, 
            R_RESOLUTION_ID,  
            R_STATUS_ID,   
            GENERATEMOVEMENT, ETIQUETE, ISARCHIVED, 
            ZCREATEFROMOPENINVOICELINES, ZSUBPAYMENTRULE_ID, GENERATEPAYMENT,C_CHARGE_ID,XX_ROWID)
        Values
          (AD_SEQUENCE_NEXTNO('R_Request'), 1000000, 1000000, 'Y',  
            :AD_User_ID,  AD_SEQUENCE_NEXTNO_DOCUMENTNO('DocumentNo_R_Request',1000000,0), :REQUESTAMT, 
            '5', '5', :SUMMARY, 
            :C_BPartner_ID,
            'F',  'N', 1000004, 
            :AD_User_ID, 'N', 
            1001538,  'A', 'A',  
            '5', 0, 0, 
            1000005, 
            1000004,  
            'N', 'N ',  'N', 
            'N', 1000022, 'N',1004980,:xx_rowId)
          `,{AD_User_ID:e.ad_user_id,REQUESTAMT:e.requestamt,SUMMARY:e.summary,
            C_BPartner_ID:e.c_bpartner_id,xx_rowId:e.xx_rowId}
        ).then(function(result) {
         cb(result)
       }).catch(function(err) {
        console.error(err);
      });
    }).catch(function(err) {
       console.error(err);
  });
}

  static getDocTyp(sql) {
    return new Promise((resolve, reject) => {
      connect.then((conn) =>{
        conn.execute(sql, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT }).then((result) => {
          resolve(result.rows);
        }).catch(function(err) {
        throw(err);
      });
      })
    }
  )}
  static getPaymentByNFC(sql) {
    return new Promise((resolve, reject) => {
      connect.then((conn) =>{
        conn.execute(sql, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT }).then((result) => {
          resolve(result.rows);
        }).catch(function(err) {
        throw(err);
      });
      })
    }
  )}
  static update(sql) {
    return new Promise((resolve, reject) => {
      connect.then((conn) =>{
        conn.execute(sql, {}, { outFormat: OracleDB.OUT_FORMAT_OBJECT }).then((result) => {
          resolve(result.rowsAffected);
        }).catch(function(err) {
        throw(err);
      });
      })
    }
  )}


}
module.exports=trk_payment_req