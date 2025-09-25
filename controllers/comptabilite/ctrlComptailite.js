const order_mission = require("../../models/comptabilite/order_mission");
const tabTiers = require("../../models/comptabilite/tabTiers");
const trk_payment_req = require("../../models/comptabilite/trk_payment_req");
const xx_bonroute = require("../../models/comptabilite/xx_bonroute");

module.exports = {
  getLIsteTransporteurs: (req, res) => {
    tabTiers.select((reponse) => {
      res.send(reponse);
    });
  },
  getListeTransport: (req, res) => {
    runGetListeTransport();
    async function runGetListeTransport() {
      let c_bpartner_id = await splitTransforme();
      appelTransporteur(c_bpartner_id);
    }
    function splitTransforme() {
      return new Promise((resolve, reject) => {
        let c_bpartner_id = req.body.c_bpartner_id;
        c_bpartner_id = c_bpartner_id.split("_")[0];
        resolve(c_bpartner_id);
      });
    }
    function appelTransporteur(c_bpartner_id) {
      let date1 = req.body.date1;
      let date2 = req.body.date2;
      if ((date1 == "") & (date2 == "")) {
        let json = { indice: 1, c_bpartner_id: c_bpartner_id };
        order_mission.select(json, (reponse) => {
          res.send(reponse);
        });
      } else if ((date1 != "") & (date2 != "")) {
        let json1 = {
          indice: 2,
          c_bpartner_id: c_bpartner_id,
          date1: inverserDate(date1),
          date2: inverserDate(date2),
        };
        order_mission.select(json1, (reponse) => {
          res.send(reponse);
        });
      }
    }
  },
  updateIsPaid: (req, res) => {
    runUpdateIsPaid();
    async function runUpdateIsPaid() {
      let xx_rowId = await runRowId();
      let insertR = await insertRequest(xx_rowId);
      let r_request_id = await runRequest_id(xx_rowId);
      let updateP = await updateBonRoute(r_request_id);
      res.send("ok");
    }
    function runRowId() {
      return new Promise((resolve, reject) => {
        let json = { indice: 3 };
        order_mission.select(json, (xx_rowId) => {
          resolve(xx_rowId[0][0]);
        });
      });
    }
    function runRequest_id(xx_rowId) {
      return new Promise((resolve, reject) => {
        let json = { indice: 4, xx_rowId: xx_rowId };
        order_mission.select(json, (r_request_id) => {
          resolve(r_request_id[0][0]);
        });
      });
    }
    function updateBonRoute(r_request_id) {
      return new Promise((resolve, reject) => {
        let json = { bonRoute: req.body.bonRoute, r_request_id: r_request_id };
        xx_bonroute.update(json, (reponse) => {
          if (reponse > 0) {
            resolve("ok");
          }
        });
      });
    }

    function insertRequest(xx_rowId) {
      return new Promise((resolve, reject) => {
        let c_bpartner_id1 = req.body.c_bpartner_id;
        c_bpartner_id1 = c_bpartner_id1.split("_")[0];
        c_bpartner_id1 = parseInt(c_bpartner_id1);
        let json = {
          ad_user_id: parseInt(req.body.ad_user_id),
          requestamt: parseFloat(req.body.p_requestamt),
          c_bpartner_id: c_bpartner_id1,
          summary: req.body.summary,
          xx_rowId: xx_rowId,
        };
        trk_payment_req.insertPayment(json, (reponse) => {
          resolve(reponse);
        });
      });
    }
  },
  processed: (req, res) => {
    let json = {
      set: ` ${req.body.nameTable} set processed='N',updatedby=${req.body.id_user} `,
      where: `where documentno='${req.body.documentno}' `,
    };
    xx_bonroute.updateProcessed(json, (reponse) => {
      if (reponse == 1) {
        res.status(200).send("Status OK");
      } else if (reponse == 0) {
        res.send("Bon de Route Erroné");
      }
    });
  },
};

function inverserDate(str) {
  return str.split("-").reverse().join("-");
}
