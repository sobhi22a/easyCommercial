const ad_user = require("../models/ad_user");
const tabUsers = require("../models/tabUsers");

module.exports.loginEx = (e, cb) => {
  ad_user.findByName(e, (response) => {
    cb(response);
  });
};

module.exports.login2 = (e, cb) => {
  let json = { indice: 203, indice1: e.indice, mdp: e.password };
  tabUsers.findByOne(json, (reponse) => {
    cb(reponse);
  });
};
