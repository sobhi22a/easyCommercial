var express = require("express");
var apiRoute = express.Router();

const oper = require("./routes/oper/oper");
const superViseur = require("./routes/superViseur/superViseur");
const login = require("./routes/login");
const recouvOper = require("./routes/recouv/recouvOper");
const contentieux = require("./routes/contentieux/contentieux");
const routeVente = require("./routes/routeVente");
const drhRoute = require("./routes/drh/drhRoute");
const comptabilite = require("./routes/comptabilite/comptabilite");
const routeInventory = require("./routes/inventaire/inventory.router");

// midleware Routes
apiRoute.use("/", login);
apiRoute.use("/oper", oper); // operateur
apiRoute.use("/routeVente", routeVente); // operateur
apiRoute.use("/superViseur", superViseur); // superviseur
apiRoute.use("/recouvOper", recouvOper); // recouverement
apiRoute.use("/contentieux", contentieux); // hadjer
apiRoute.use("/drhRoute", drhRoute);

// route apiRoutelication
apiRoute.use("/comptabilite", comptabilite); // route paiment salaire et mehdi zenati
apiRoute.use("/routeInventory", routeInventory); // route hadjer

apiRoute.use("/logout", function (req, res, next) {
  res.clearCookie("/", { path: "/" });

  res.redirect("/easy");
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) return next(err);
    });
  }
});

module.exports = apiRoute;
