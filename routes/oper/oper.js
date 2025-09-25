const express = require("express");
const oper = express.Router();

const ctrlOper = require("../../controllers/oper/ctrlOper");
const ctrlRecouvOper = require("../../controllers/recouv/ctrlRecouvOper");

oper.get("/", (req, res) => {
  res.render("oper/oper");
});

oper.post("/dejaCreer", ctrlOper.dejaCreer);
oper.post("/getBccJour", ctrlOper.getBccJour);
oper.post("/bccSelectOper", ctrlOper.bccSelectOper);
oper.post("/sauverBcc", ctrlOper.sauverBcc);
oper.delete("/suppDocumentno", ctrlOper.suppDocumentno);
oper.delete("/deleteBccExiste", ctrlOper.deleteBccExiste);
oper.post("/listeDemandeQuota", ctrlOper.listeDemandeQuota);
oper.post("/getClientsSelectAsked", ctrlOper.getClientsSelectAsked);
oper.put("/actionProduit", ctrlOper.modifierProduitQuota);
oper.get("/quotaExcel", ctrlOper.quotaExcel);

// nouveau API Angular
oper.post("/newAskQuota", ctrlOper.newAskQuota);

// feature Route
oper.get("/runGetReference", ctrlOper.runGetReference);

// oper.post("/listeProduitQuota", ctrlOper.listeProduitQuota);

oper.post("/listeClientParOper", ctrlOper.listeClientParOper);
oper.post("/traiterQuota", ctrlOper.traiterQuota);

// api nouveau clients
oper.post("/insertionNV", ctrlOper.insertionNV);
oper.post("/listNouveauClient", ctrlOper.listNouveauClient);
oper.post("/valideSVC", ctrlOper.valideSVC);
oper.delete("/gestionClient", ctrlOper.deleteClient);
oper.put("/gestionClient", ctrlOper.modifierClient);

// route Operateur
oper.post("/bloqueOperDc1", ctrlOper.bloqueOperDc1);

// page débloque Clients
oper.post("/getClientOperr", ctrlRecouvOper.getClientOperr);
oper.post("/getClientProsp", ctrlRecouvOper.getClientProsp);
oper.post("/deploqueClient", ctrlRecouvOper.deploqueClient);
oper.post("/suppDemandeDeploque", ctrlRecouvOper.suppDemandeDeploque);
oper.post("/listeDemandeDeploque", ctrlRecouvOper.listeDemandeDeploque);

module.exports = oper;
