const express = require("express");
const {
  syncDataInventory,
  addNewLineInventorProduct,
  getListProductInventoryByDate,
  modifyIsFinished,
  deleteLineInventoryProduct,
} = require("../../controllers/stock/inventaire/inventaire.controller");
const routeInventory = express.Router();

routeInventory.post("/addNewLineInventorProduct", addNewLineInventorProduct); // don't remove this route
routeInventory.post("/syncDataInventory", syncDataInventory); // don't remove this route
routeInventory.post("/getListProductInventoryByDate", getListProductInventoryByDate); // don't remove this route
routeInventory.post("/modifyIsFinished", modifyIsFinished); // don't remove this route
routeInventory.post("/deleteLineInventoryProduct", deleteLineInventoryProduct); // don't remove this route

module.exports = routeInventory;
