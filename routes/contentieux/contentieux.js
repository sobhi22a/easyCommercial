const express = require("express");
const contentieux = express.Router();

const CtrlContentieux = require("../../controllers/contentieux/CtrlContentieux");
const dtControler = require("../../controllers/stock/ctrlDT/dt.controler");

contentieux.get("/", (req, res) => {
  res.render("contentieux/contentieux");
});

contentieux.post("/validerClient", CtrlContentieux.validerClient);
//vert controler DT
contentieux.post("/getParametreDt", dtControler.getParametreDt);
contentieux.post("/getListCorrectionToDt", dtControler.getListCorrectionToDt);
contentieux.get("/getStatPreparation", dtControler.getStatPreparation);
contentieux.get("/getStatPreparationDetail", dtControler.getStatPreparationDetail);

contentieux.post("/getAdUserName", dtControler.getAdUserName);
contentieux.post("/getClientOrder", dtControler.getClientOrder);
contentieux.post("/updateQuantityOrder", dtControler.updateQuantityOrder);
contentieux.post("/selectProductOrder", dtControler.selectProductOrder);
contentieux.post("/modifyQuantity", dtControler.modifyQuantity);
contentieux.post("/getListInventaireByDate", dtControler.getListInventaireByDate);

module.exports = contentieux;
