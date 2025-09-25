const trk_payment_req = require("../../models/comptabilite/trk_payment_req");
const axios = require('axios');
const { CPaymentRepository } = require("../../repositories/CPaymentRepository");
const { AdSequenceRepository } = require("../../repositories/AdSequenceRepository");

module.exports = {
    getDocType: async (req, res) => {

      try {
        let sql = `SELECT BC.C_BankAccount_ID,BC.AD_USER_ID,DT.NAME,DT.DOCBASETYPE,BC.ACCOUNTNO,DT.ad_orgtrx_id,DT.c_doctype_id, BC.CURRENTBALANCE FROM C_BankAccount BC
          INNER JOIN C_BankAccountDoc BCD ON BC.C_BANKACCOUNT_ID=BCD.C_BANKACCOUNT_ID
          INNER JOIN C_DOCTYPE DT ON DT.C_DOCTYPE_ID=BCD.C_DOCTYPE_ID
          WHERE BC.AD_USER_ID=${parseInt(req.body.ad_user_id)} and DT.DOCBASETYPE = 'APP' and DT.ad_orgtrx_id = 1000316`;
        let result = await trk_payment_req.getDocTyp(sql);
        res.status(200).send({ message: "", result });
      } catch (error) {
        res.status(404).send({ message: "Error when fetching data", result: error });
        throw error;
      }
    },
    getPaymentByNFC: async (req, res) => {
      try {
      let sql = `SELECT GRANDTOTAL,C_INVOICE_ID,IV.C_BPARTNER_ID,BP.NAME,IV.ISSOTRX,IV.ISRETURNTRX, IV.DESCRIPTION,IV.AD_ORG_ID
          FROM C_Invoice IV
          INNER JOIN C_BPARTNER BP ON IV.C_BPARTNER_ID=BP.C_BPARTNER_ID
          INNER JOIN XX_NfcCard NFC ON NFC.C_BPARTNER_ID=BP.C_BPARTNER_ID
          WHERE IV.ISPAID='N' AND IV.C_DocType_ID=1003921 and NFC.NFCUID = '${req.body.nfc}'`;
        let result = await trk_payment_req.getPaymentByNFC(sql);
        res.status(200).send({ message: "", result });
      } catch (error) {
        res.status(404).send({ message: "Error when fetching data", result: error });
        throw error;
      }
    },
  createPayment: async (req, res) => {
    try{
      const postData = req.body;
      const apiUrl = "http://10.3.16.7:8081/compws/rest/payment/create";
      let now = new Date(postData.created);
      let documentNo = await AdSequenceRepository();
      const body = {
        c_DocType_ID: parseInt(postData.c_DocType_ID),
        c_Currency_ID: 235,
        ad_Client_ID: 1000000,
        c_Bank_ID: parseInt(postData.c_Bank_ID),
        ad_Org_ID: parseInt(postData.ad_Org_ID),
        ad_User_ID: parseInt(postData.ad_User_ID),
        c_BPartner_ID: parseInt(postData.c_BPartner_ID),
        createdBy: parseInt(postData.ad_User_ID),
        z_PaymentCommunication: '',// documentno , client , date a HH:MM , montant
        description: postData.description,
        documentNo: `${documentNo}/PAY${getFormattedYear()}`,
        created: now,
        dateTrx: sysDate1(now),
        payAmt: parseFloat(postData.payAmt),
        docAction: postData.docAction,
        xx_Latitude: parseInt(postData.xx_Latitude),
        xx_Longitude: parseInt(postData.xx_Longitude),
        state: postData.state,
        zSubPaymentRule_ID: parseInt(postData.zSubPaymentRule_ID),
        routingNo:  null,
        checkNo: null,
      }
      const headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic QkVOREVSUkFESkk6N2JjY2ZkZTc3MTRhMWViYWRmMDZjNWY0Y2VhNzUyYzE=",
      };
      const result = await axios.post(apiUrl, body, { headers });
      if(result.status == 201) {
        let bodyU = {
          C_BPARTNER_ID: parseInt(postData.c_BPartner_ID),
          C_INVOICE_ID:  parseInt(postData.c_invoice_id)
        }
        let requte = await CPaymentRepository(bodyU);
        let sql = `update c_invoice set ISPAID='Y' where c_invoice_id=${parseInt(req.body.c_invoice_id)}`;
        await trk_payment_req.update(sql);
      }
      res.status(201).send({ message: "", result: 'OK' });
    }catch (error) {
      res.status(400).send({ message: "Erreur Lors de la creation paiement ", error });
    }
  }
};

function sysDate1(now) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Add 1 to month because it's zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

function getFormattedYear() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    return year;
}
