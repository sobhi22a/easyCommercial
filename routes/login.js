const express = require("express");
const login = express.Router();
const ctrlConnect = require("../controllers/ctrlConnect");

login.get("/", (req, res) => {
  res.render("login");
});
class User {}
login.post("/", (req, res) => {
  ctrlConnect.login2(req.body, (resp) => {
    if (resp.length) {
      ctrlConnect.loginEx(req.body, (response) => {
        let id = response[0].AD_USER_ID;
        let value = response[0].VALUE;
        let org = resp[0].ad_org_id;
        let indice = response[0].NAME;
        let role = resp[0].role;
        let id_dc = resp[0].id_dc;
        let id_svc = resp[0].id_svc;
        let sip = response[0].SIP;
        let c_bpartner_id = response[0].C_BPARTNER_ID;
        switch (role) {
          case 1:
            res.render("superViseur/superViseur", {
              id: id,
              org: org,
              indice: indice,
              value: value,
              id_dc: id_dc,
              id_svc: id_svc,
            });
            break;
          case 2:
            res.render("oper/oper", {
              id: id,
              org: org,
              indice: indice,
              value: value,
              id_dc: id_dc,
              id_svc: id_svc,
              sip: sip,
            });
            break;
          case 3:
            res.render("recouv/pageRecouv", {
              id: id,
              org: org,
              indice: indice,
              value: value,
              id_dc: id_dc,
              id_svc: id_svc,
              roles: role,
            });
            break;
            case 13:
              res.render("recouv/pageRecouv", {
                id: id,
                org: org,
                indice: indice,
                value: value,
                id_dc: id_dc,
                id_svc: id_svc,
                roles: role,
              });
              break;
          case 4:
            res.render("contentieux/pageContentieux", {
              id: id,
              org: org,
              indice: indice,
              value: value,
              id_dc: id_dc,
              id_svc: id_svc,
            });
            break;
          case 5:
            res.render("stock/stock", {
              id: id,
              org: org,
              indice: indice,
              value: value,
              id_dc: id_dc,
              id_svc: id_svc,
              c_bpartner_id: c_bpartner_id,
              roles: role,
            });
            break;
          case 6:
            res.render("stock/stock", {
              id: id,
              org: org,
              indice: indice,
              value: value,
              id_dc: id_dc,
              id_svc: id_svc,
              c_bpartner_id: c_bpartner_id,
              roles: role,
            });
            break;
          case 7:
            res.render("drh/drh", { id: id, org: org, indice: indice });
            break;
          case 8:
            res.render("expedition/expedition", {
              id: id,
              org: org,
              indice: indice,
            });
            break;
          case 9:
            res.render("comptabilite/comptabilite", {
              id: id,
              org: org,
              indice: indice,
            });
            break;
          case 11:
            res.render("stock/preparation/preparation", {
              id: id,
              org: org,
              indice: indice,
              value: value,
              id_dc: id_dc,
              id_svc: id_svc,
              c_bpartner_id: c_bpartner_id,
              roles: role,
            });
            break;
          case 12:
            res.render("contentieux/pageContentieux", {
              id: id,
              org: org,
              indice: indice,
              value: value,
              id_dc: id_dc,
              id_svc: id_svc,
              c_bpartner_id: c_bpartner_id,
              roles: role,
            });
            break;
          default:
            res.render("/", { message: "Indice Ou Mot De Passe erroné" });
        }
      });
    } else {
      res.render("login", { message: "Indice Ou Mot De Passe erroné" });
    }
  });
});

login.post("/login", (req, res) => {
  runLogin();
  async function runLogin() {
    let dataMySql = await runExisteMysql();
    let dataOracle = dataMySql.length
      ? await runDataOracle()
      : res.redirect("/");
    redirectConnect(dataMySql, dataOracle);
  }

  function runExisteMysql() {
    return new Promise((resolve, reject) => {
      ctrlConnect.login2(req.body, (result) => {
        resolve(result);
      });
    });
  }

  function runDataOracle() {
    return new Promise((resolve, reject) => {
      ctrlConnect.loginEx(req.body, (result) => {
        resolve(result);
      });
    });
  }

  function redirectConnect(dataMySql, dataOracle) {
    switch (dataMySql[0].role) {
      case 1:
        res.send({
          ad_user_id: dataOracle[0].AD_USER_ID,
          ad_org_id: dataOracle[0].AD_ORG_ID,
          indice: dataMySql[0].indice,
          value: dataOracle[0].SIP,
          id_dc: dataMySql[0].id_dc,
          id_svc: dataMySql[0].id_svc,
        });
        break;
      case 2:
        res.send({
          ad_user_id: dataOracle[0].AD_USER_ID,
          ad_org_id: dataOracle[0].AD_ORG_ID,
          indice: dataMySql[0].indice,
          value: dataOracle[0].SIP,
          id_dc: dataMySql[0].id_dc,
          id_svc: dataMySql[0].id_svc,
        });
        break;
      // case 3:
      //   res.send({
      //     id: id,
      //     org: org,
      //     indice: indice,
      //     value: value,
      //     id_dc: id_dc,
      //     id_svc: id_svc,
      //   });
      //   break;
      // case 4:
      //   res.send({
      //     id: id,
      //     org: org,
      //     indice: indice,
      //     value: value,
      //     id_dc: id_dc,
      //     id_svc: id_svc,
      //   });
      //   break;
      // case 5:
      //   res.send({
      //     id: id,
      //     org: org,
      //     indice: indice,
      //     value: value,
      //     id_dc: id_dc,
      //     id_svc: id_svc,
      //     c_bpartner_id: c_bpartner_id,
      //     roles: role,
      //   });
      //   break;
      // case 6:
      //   res.render("stock/stock", {
      //     id: id,
      //     org: org,
      //     indice: indice,
      //     value: value,
      //     id_dc: id_dc,
      //     id_svc: id_svc,
      //     c_bpartner_id: c_bpartner_id,
      //     roles: role,
      //   });
      //   break;
      // case 7:
      //   res.render("drh/drh", { id: id, org: org, indice: indice });
      //   break;
      // case 8:
      //   res.render("expedition/expedition", {
      //     id: id,
      //     org: org,
      //     indice: indice,
      //   });
      //   break;
      // case 9:
      //   res.render("comptabilite/comptabilite", {
      //     id: id,
      //     org: org,
      //     indice: indice,
      //   });
      //   break;
      // case 11:
      //   res.render("stock/preparation/preparation", {
      //     id: id,
      //     org: org,
      //     indice: indice,
      //     value: value,
      //     id_dc: id_dc,
      //     id_svc: id_svc,
      //     c_bpartner_id: c_bpartner_id,
      //     roles: role,
      //   });
      //   break;
    }
  }
});

module.exports = login;
