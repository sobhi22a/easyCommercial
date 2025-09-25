const express = require("express");
const recouv = express.Router();

const ctrlRecouvOper = require("../../controllers/recouv/ctrlRecouvOper");
const imprimerFicheClient = require("../../controllers/recouv/ficheClient");

recouv.post("/getRegionSV", ctrlRecouvOper.getRegionSV);
recouv.post("/getLivreur", ctrlRecouvOper.getLivreur);
recouv.post("/getBonRoute", ctrlRecouvOper.getBonRoute);
recouv.post("/detailBonRoute", ctrlRecouvOper.detailBonRoute);
recouv.post("/excellentClient", ctrlRecouvOper.excellentClient);
recouv.post("/getListClientExcellent", ctrlRecouvOper.getListClientExcellent);
recouv.post("/demandeNouveauSeuil", ctrlRecouvOper.demandeNouveauSeuil);
recouv.post("/modifierSeuilClient", ctrlRecouvOper.modifierSeuilClient);
recouv.post("/majBalance", ctrlRecouvOper.majBalance);

//imprimer
recouv.get("/printFile", imprimerFicheClient.imprimerFicheClient);

//page Recouvement debloque Clients
recouv.post("/getListeClientUnblocked", ctrlRecouvOper.getListeClientUnblocked);
recouv.post("/selectClientUnblocked", ctrlRecouvOper.selectClientUnblocked);
recouv.post("/selectInfoClient", ctrlRecouvOper.selectInfoClient);
recouv.post("/actionClientUnblocked", ctrlRecouvOper.actionClientUnblocked);
recouv.post("/tableDebloqueAuj", ctrlRecouvOper.tableDebloqueAuj);
recouv.post("/annulerDebloque", ctrlRecouvOper.annulerDebloque);

//page historique
recouv.post("/vueRecouv", ctrlRecouvOper.vueRecouv);
recouv.patch("/validProspectToUnlocked", ctrlRecouvOper.validProspectToUnlocked);
recouv.post("/vueRecouv1", ctrlRecouvOper.vueRecouv1);

//page nouveau clients
recouv.get("/listeNvClientRecouv", ctrlRecouvOper.listeNvClientRecouv);
recouv.post("/selectClientNV", ctrlRecouvOper.selectClientNV);
recouv.put("/validerClient", ctrlRecouvOper.validerClient);

module.exports = recouv;
