const express = require("express");
const drh = express.Router();

const ctrlPaie = require("../../controllers/ctrlDrh/ctrlPaie");

//ctrl Paie Livreur
drh.post("/listeLivreur", ctrlPaie.listeLivreur);
drh.post("/calculePrimeLivreur", ctrlPaie.calculePrimeLivreurNew);

module.exports = drh;
