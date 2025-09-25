const tabNclient = require("../../models/tabNclients");

module.exports = {
  validerClient: (req, res) => {
    let json = {
      indice: 3,
      valide: "C",
      dateContentieux: dateNow(),
      idClient: req.body.idClient,
    };
    tabNclient.update(json);
    res.status(200).send("ok");
  },
};

function dateNow() {
  let dt = new Date();
  return dt;
}
