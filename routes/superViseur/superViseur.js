const express = require("express");
const superViseur = express.Router();
const ctrlListeDemadeQuota = require("../../controllers/superVisuer/listeDemandeQuota");
const ctrlAccorder = require("../../controllers/superVisuer/ctrlAccorder");
const ctrlXxArrivage = require("../../controllers/superVisuer/xx_arrivage");

superViseur.get("/", (req, res) => {
  res.render("superViseur/superViseur");
});

// route of ctrlListeDemadeQuota
superViseur.get("/demandeListQuota", ctrlListeDemadeQuota.listeDemandeQuota);
superViseur.post("/listeDemande", ctrlListeDemadeQuota.listeDemandeQuota);
superViseur.post("/listeBccDemander", ctrlListeDemadeQuota.listeBccDemander);
superViseur.post("/getProduitQuotaClient", ctrlListeDemadeQuota.getProduitQuotaClient);
superViseur.post("/getProduitBcc", ctrlListeDemadeQuota.getProduitBcc);
superViseur.post("/getProduitModifier", ctrlListeDemadeQuota.getProduitModifier);
superViseur.put("/confirmerQuotaFinal", ctrlListeDemadeQuota.confirmerQuotaFinal);
superViseur.put("/confirmerQuotaFinalTT", ctrlListeDemadeQuota.confirmerQuotaFinalTT);
superViseur.post("/comandeApprouver", ctrlListeDemadeQuota.comandeApprouver);
superViseur.get("/getVenteFlashListe", ctrlListeDemadeQuota.getVenteFlashListe);
superViseur.post("/getUgVenteFlashParProduit", ctrlListeDemadeQuota.getUgVenteFlashParProduit);

//ctrl Accorder
superViseur.post("/listeNvClientSV", ctrlAccorder.listeNvClientSV);
superViseur.post("/selectClientNV", ctrlAccorder.selectClientNV);
superViseur.put("/validerClient", ctrlAccorder.validerClient);
superViseur.get("/getProductColor", ctrlAccorder.getProductColor);
superViseur.post("/validerColor", ctrlAccorder.validerColor);
superViseur.get("/getColor", ctrlAccorder.getColor);
superViseur.post("/couleurCommande", ctrlAccorder.couleurCommande);
superViseur.post("/couleurCommandeConfirmer", ctrlAccorder.couleurCommandeConfirmer);
superViseur.post("/xx_arrivage", ctrlAccorder.xx_arrivage);
superViseur.post("/updateQtyBase", ctrlAccorder.updateQtyBase);
superViseur.post("/getListeDC", ctrlAccorder.getListeDC);
superViseur.post("/xx_arrivageAdmin", ctrlAccorder.xx_arrivageAdmin);
superViseur.post("/commandeReserve", ctrlAccorder.commandeReserve);
superViseur.post("/qtsReserver", ctrlAccorder.qtsReserver);
superViseur.put("/updateCommande", ctrlAccorder.updateCommande);
superViseur.post("/bloqueOper", ctrlAccorder.bloqueOper);
superViseur.delete("/annulerLignereserver", ctrlAccorder.deleteReservationLine);
superViseur.put("/statusCommande", ctrlAccorder.statusCommande);

/// Route xx_Arrivage
superViseur.post("/renouvelerStock", ctrlXxArrivage.renouvelerStock);
superViseur.post("/getProductsRestore", ctrlXxArrivage.getProductsRestore);
superViseur.post("/restaurerProduits", ctrlXxArrivage.restaurerProduits);
superViseur.post("/produitPartager", ctrlXxArrivage.produitPartager);
superViseur.post("/produitPartagerGlobale", ctrlXxArrivage.produitPartagerGlobale);
superViseur.post("/ajouterQteMax", ctrlXxArrivage.ajouterQteMax);
superViseur.post("/getLastWeek", ctrlXxArrivage.getLastWeek);
superViseur.post("/getLastMonth", ctrlXxArrivage.getLastMonth);

module.exports = superViseur;
