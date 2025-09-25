const express = require("express");
const comptabilite = express.Router();
const ctrlComptailite = require("../../controllers/comptabilite/ctrlComptailite");
const ctrlPayment = require("../../controllers/comptabilite/ctrlPayment");

comptabilite.post("/getLIsteTransporteurs", ctrlComptailite.getLIsteTransporteurs);
comptabilite.post("/getListeTransport", ctrlComptailite.getListeTransport);
comptabilite.post("/updateIsPaid", ctrlComptailite.updateIsPaid);
comptabilite.post("/processed", ctrlComptailite.processed);

//partie pay roll
comptabilite.post("/getDocType", ctrlPayment.getDocType); // ok 
comptabilite.post("/getPaymentByNFC", ctrlPayment.getPaymentByNFC); // ok
comptabilite.post("/createPayment", ctrlPayment.createPayment); // ok

module.exports = comptabilite;
