const { QueryTypes } = require('sequelize');
const oracle = require('../config/oracle/oracledb');
// const C_INVOICE = require('../models/oracle/c_invoice');
module.exports.GetAllOldPayment = async (c_Bpartner_id) => {
  try {
    var sql = `select * from 
          (select IV.C_bpartner_ID,IV.c_invoice_id,IV.documentno ,IV.grandtotal,
          case when IV.isreturntrx='N' 
          then IV.grandtotal else -IV.grandtotal 
          end -coalesce( verse(IV.c_invoice_id),0) as reste ,IV.isreturntrx,IV.issotrx,BADOC.c_doctype_id,to_char(IV.created) as created, IV.ad_org_id,
          IV.isRemotePaid,IV.ad_orgtrx_id,IV.ZSUBPAYMENTRULE_ID, BADOC.C_BANKACCOUNT_ID,NFC.NFCUID,BP.PASSWORD, BP.XX_SEQORDEREXP, BP.name as client,CDT.DOCNOSEQUENCE_ID
          from c_invoice IV 
          LEFT OUTER JOIN C_DOCTYPE DT ON DT.C_DOCTYPE_ID=IV.C_DOCTYPE_ID
          LEFT OUTER JOIN C_BANKACCOUNTDOC BADOC ON BADOC.C_BANKACCOUNTDOC_ID = DT.C_BANKACCOUNTDOC_ID
          INNER JOIN C_BPARTNER BP ON IV.C_BPARTNER_ID=BP.C_BPARTNER_ID
          LEFT OUTER JOIN XX_NfcCard NFC ON  NFC.C_BPARTNER_ID=BP.C_BPARTNER_ID
          LEFT OUTER JOIN C_DOCTYPE CDT ON CDT.C_DOCTYPE_ID = BADOC.C_DOCTYPE_ID
          where IV.C_BPartner_ID=${c_Bpartner_id} and IV.ispaid='N' ) where reste > 2;`
      return await oracle.sequelize.query(sql, { type: QueryTypes.SELECT });
    } catch (error) {
        console.error(error);
    };
};