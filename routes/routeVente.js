const express = require("express");
const route = express.Router();

const serverVenteQuota = require("../controllers/oper/serverVenteQuota");

route.post("/getProduit", serverVenteQuota.getProduit);
route.post("/ajouterProduitOrder", serverVenteQuota.addProductXxQuota);
route.post("/quotaDemander", serverVenteQuota.quotaDemander);
route.post("/supprimerQuota", serverVenteQuota.deleteLineXxQuotaByOper);
route.post("/modifierProduitsQuota", serverVenteQuota.modifyProductQuotaBySV);
route.put("/bloqueClientDc", serverVenteQuota.bloqueClientDc);
route.put("/updateQtyAdmineBase", serverVenteQuota.updateQtyAdmineBase);
route.get("/listSvc", serverVenteQuota.listSvc);

module.exports = route;
