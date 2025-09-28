const tabCorder = require("../../models/tabCorder");
const tabTiers = require("../../models/tabTiers");
const tabNclient = require("../../models/tabNclients");
const tabUsers = require("../../models/tabUsers");
const tabXx_quotaRef = require("../../models/tabXx_quotaRef");
const tabParametre = require("../../models/tabParametre");
const tabXx_quota = require("../../models/tabXx_quota");
const excel = require("exceljs");

module.exports = {
  runGetReference: (req, res) => {
    try {
      runGetReference();
      async function runGetReference() {
        let updateReference = await runUpdateReference();
        res.status(200).send({ reference: updateReference });
      }
      function runUpdateReference() {
        return new Promise((resolve, reject) => {
          let sql = `insert into parametre set req_quota_ref=1000000`;
          tabParametre.insert(sql, (reference) => {
            resolve(reference.insertId);
          });
        });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },
  listeBcc: (cb) => {
    var d = datea();
    tabCorder.finfAll(d, async (liste) => {
      await cb(liste);
    });
  },
  listeClientParOper: async (req, res) => {
    try {
      const json = {
        ad_user_id: req.body.ad_user_id,
        ad_org_id: req.body.ad_org_id,
        dt: datea(),
      };
      console.log(json);
      const response = await tabTiers.findOne(json);
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  traiterQuota: (req, res) => {
    try {
      runCondition();
      async function runCondition() {
        let isCondition = await getIsCondition(req.body.reference);
        traiterCommande(isCondition);
      }

      function getIsCondition(reference) {
        return new Promise((resolve, reject) => {
          let sql = `select max(ISCONDITION) as isCondition from xx_quota where reference = ${reference} `;
          tabXx_quota.selectAll(sql, (reponse) => {
            resolve(reponse[0].ISCONDITION);
          });
        });
      }
      function traiterCommande(isCondition) {
        let json = {
          indice: 2,
          traiter: req.body.traiter,
          dateTraiter: sysDate(),
          reference: req.body.reference,
          confirme: req.body.confirme,
          isCondition,
        };
        tabXx_quotaRef.update(json, (reponse) => {
          reponse > 0 ? res.status(200).send([reponse]) : res.status(200).send("No Rows Affected");
        });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getClientConfirmer: (req, res) => {
    try {
      let json27 = { id_user: req.body.id_user, dt: dateOracle() };
      req_quota.findbyOne(311, json27, async (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  tableProduitConfirmer: (id, cb) => {
    tabReq_quota_line.findByOne(1, id, async (reponse) => {
      await cb(reponse);
    });
  },
  insertionNV: (req, res) => {
    try {
      let dt = new Date();
      let json11 = {
        nomClient: req.body.nomClient,
        nTel1: req.body.nTel1,
        nTel2: req.body.nTel2,
        adresse1: req.body.adresse1,
        wilaya: req.body.wilaya,
        rc: req.body.rc,
        nif: req.body.nif,
        ai: req.body.ai,
        bl: req.body.bl,
        fact: req.body.fact,
        indiceOper: req.body.indiceOper,
        id_org: req.body.id_org,
        para: req.body.para,
        dateCreation: dt,
      };
      tabNclient.insert(json11);
      res.status(200).send("valide");
    } catch (error) {
      res.status(400).send(error);
    }
  },
  listNouveauClient: (req, res) => {
    try {
      let json12 = { indice: 2, operateur: req.body.indiceOper };
      tabNclient.select(json12, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  valideSVC: (req, res) => {
    try {
      let json = {
        indice: 10204,
        indiceSVC: req.body.indiceSVC,
        mdp: req.body.mdpSVC,
        role: 1,
      };
      tabUsers.findByOne(json, (reponse) => {
        if (reponse.length == 1) {
          let json24 = {
            indice: 2,
            svc: reponse[0].indice,
            valide: "S",
            idClient: req.body.idClient,
            dateSVC: sysDate(),
          };
          tabNclient.update(json24);
          res.status(200).send("ok");
        } else if (reponse.length != 1) {
          res.status(400).send("echec");
        }
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  deleteClient: (req, res) => {
    try {
      let json = { indice: 1, idClient: req.body.idClient };
      tabNclient.delete(json, (reponse) => {
        res.status(200).send([reponse]);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  modifierClient: (req, res) => {
    try {
      let json25 = { indice: 1, idClient: req.body.idClient };
      tabNclient.select(json25, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getBccJour: (req, res) => {
    try {
      let json = {
        bp: req.body.c_bpartner_id,
        sal: req.body.salesrep_id,
        ad_org_id: req.body.ad_org_id,
      };
      tabCorder.bccParClient(json, (documentno) => {
        res.status(200).send(documentno);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  sauverBcc: (req, res) => {
    try {
      let sql = `select * from xx_quotaref where reference=${req.body.reference} and dateCreation='${dateOracle()}'`;
      tabXx_quotaRef.featuresSelect(sql, (repp) => {
        res.status(200).send(repp);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  bccSelectOper: (req, res) => {
    try {
      let donne = req.body.c_order_id;
      let c_order_id = donne.split("-")[0];
      let documentno = donne.split("-")[1];
      let docStatus = donne.split("-")[2];
      let jsonName = { indice: 1, c_bpartner_id: req.body.c_bpartner_id };
      runBccSelectOper();
      async function runBccSelectOper() {
        let nameClient = await runNameClient();
        let ad_org_id = await runGetOrganization();
        await runInsert(nameClient, req.body.id_svc, docStatus, ad_org_id);
      }
      function runGetOrganization() {
        return new Promise(async (resolve, reject) => {
          let sql = `select ad_orgTrx_id from c_order where c_order_id=${c_order_id}`;
          let result = await tabTiers.selectPromise(sql);
          resolve(result[0].AD_ORGTRX_ID);
        });
      }
      function runNameClient() {
        return new Promise((resolve, reject) => {
          tabTiers.select(jsonName, (reponse) => {
            resolve(reponse[0][0]);
          });
        });
      }
      function runInsert(name, id_svc, docStatus, ad_org_id) {
        return new Promise((resolve, reject) => {
          if (req.body.reference) {
            let json11 = {
              indice: 2,
              c_bpartner_id: req.body.c_bpartner_id,
              documentno: documentno,
              c_order_id: c_order_id,
              dateCreation: dateOracle(),
              timeCreation: heure(),
              createby: req.body.indiceOper,
              ad_user_id: req.body.ad_user_id,
              nomTiers: name,
              ad_org_id,
              reference: req.body.reference,
              id_svc: id_svc,
              docStatus: docStatus,
            };
            tabXx_quotaRef.insert(json11, (reponse) => {
              res.status(200).send(reponse);
            });
          }
        });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },
  dejaCreer: (req, res) => {
    //function delete after deploy angular
    try {
      let sql = `select * from xx_quotaref 
      where c_pbartner_id=${req.body.id_client} 
      and dateCreation='${dateOracle()}' 
      and confirme='N' 
      and ad_org_id=${req.body.ad_org_id}`;
      tabXx_quotaRef.featuresSelect(sql, (rep) => {
        if (rep.length == 0) {
          res.status(200).send("vide");
        } else {
          let json = {
            indice: 210,
            traiter: "N",
            reference: rep[0].reference,
            confirme: "N",
          };
          tabXx_quotaRef.update(json, (reponse) => {
            reponse > 0 && res.status(200).send(rep);
          });
        }
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  newAskQuota: (req, res) => {
    try {
      let sql = `select * from xx_quotaref where c_pbartner_id=${
        req.body.C_BPARTNER_ID
      } and dateCreation='${dateOracle()}' and confirme='N' and ad_org_id=${req.body.ad_org_id}`;
      tabXx_quotaRef.featuresSelect(sql, (result) => {
        res.status(200).send({
          c_bpartner_id: req.body.C_BPARTNER_ID,
          isExisted: result.length.toString(),
        });
      });
    } catch (error) {
      res.status(404).send(error);
    }
  },
  modifierProduitQuota: (req, res) => {
    try {
      let json = {
        indice: 912,
        m_product_id: req.body.m_product_id,
        reference: req.body.reference,
      };
      tabXx_quota.select(json, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  listeDemandeQuota: (req, res) => {
    try {
      let sql = `select DISTINCT(reference),nomTiers,traiter,confirme,c_pbartner_id,status,ad_org_id from xx_quotaref 
      where ad_user_id='${req.body.ad_user_id}' and dateCreation='${dateOracle()}'`;
      tabXx_quotaRef.featuresSelect(sql, (rep) => {
        res.status(200).send(rep);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getClientsSelectAsked: (req, res) => {
    try {
      runGetClientsSelectAsked();
      async function runGetClientsSelectAsked() {
        let update = await updateXxQuotaRef();
        let select = await selectXxquotaRef();
        let selectRef = await selectReference();
        res.status(200).send({ IXxQuotaRef: select, IXxquota: selectRef });
      }

      function selectReference() {
        return new Promise((resolve, reject) => {
          let json = {
            indice: 122,
            reference: req.body.reference,
          };
          tabXx_quota.select(json, (List) => {
            resolve(List);
          });
        });
      }
      function selectXxquotaRef() {
        return new Promise((resolve, reject) => {
          let json = {
            indice: 2,
            reference: req.body.reference,
            dateCreation: dateOracle(),
          };
          tabXx_quotaRef.select(json, (reponse) => {
            resolve(reponse);
          });
        });
      }

      function updateXxQuotaRef() {
        return new Promise((resolve, reject) => {
          let json = {
            indice: 210,
            traiter: "N",
            reference: req.body.reference,
            confirme: "N",
          };
          tabXx_quotaRef.update(json, (affected) => {
            resolve(affected);
          });
        });
      }
    } catch (error) {
      res.status(404).send(error);
    }
  },
  bloqueOperDc1: (req, res) => {
    try {
      let json = { indice: 2, indiceOper: req.body.indiceOper };
      tabUsers.findByOne(json, (reponse) => {
        reponse[0].bloque == "N" ? res.send("N") : res.send("Y");
      });
    } catch (error) {
      res.status(404).send(error);
    }
  },

  suppDocumentno: (req, res) => {
    try {
      runSuppDocumentno();
      async function runSuppDocumentno() {
        let existe = await runExiste();
        existe.length == 0 && runDelete();
        existe.length != 0 && res.status(200).send("Tu Peux Pas Supprimer");
      }
      function runExiste() {
        return new Promise((resolve, reject) => {
          let json2 = { indice: 12, reference: req.body.reference };
          tabXx_quota.select(json2, (repp) => {
            resolve(repp);
          });
        });
      }
      function runDelete() {
        return new Promise((resolve, reject) => {
          let json = {
            indice: 110,
            idBccQuota: req.body.idBccQuota,
            confirme: "N",
            traiter: "N",
          };
          tabXx_quotaRef.delete(json, (reponse) => {
            if (reponse == 1) {
              let json1 = {
                indice: 2,
                reference: req.body.reference,
              };
              tabXx_quotaRef.select(json1, (bcc) => {
                res.status(200).send(bcc);
              });
            } else {
              res.status(200).send("Liste des BCC confirmée par la directrice commerciale");
            }
          });
        });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },
  deleteBccExiste: (req, res) => {
    try {
      let sql = `delete from xx_quotaref where documentno='${req.body.documentno}' and traiter='N' and confirme='N'`;
      tabXx_quotaRef.featuresDelete(sql, (result) => {
        res.status(200).send(result);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  quotaExcel: (req, res) => {
    let id_userExcel = req.query.id_userExcel;
    runExcel();
    async function runExcel() {
      let quotaa = req.query.hasOwnProperty("id_svc") ? await getDonneeOper(req.query) : await getDonneeDC();
      await constExcel(quotaa, req.query);
    }
    function getDonneeDC() {
      return new Promise((resolve, reject) => {
        let jsonDC = { id_dc: id_userExcel, ad_org_id: 0 };
        tabXx_quota.findProduitExcel(jsonDC, (obj) => {
          resolve(obj);
        });
      });
    }
    function getDonneeOper(jsonDC) {
      return new Promise((resole, reject) => {
        let sql = `SELECT q.m_product_id,pr.name,q.qtyordered quantity from xx_quota q 
          inner join m_product pr
          on q.m_product_id=pr.m_product_id
          inner join AD_User adu on adu.AD_User_ID=q.createdby
          where (q.createdby=${parseInt(jsonDC.id_dc)} and q.ad_org_id=0 and qtyordered>0)
          OR (q.createdby =${parseInt(jsonDC.id_svc)} and qtyordered>0) order by pr.name desc`;
        tabXx_quota.findProduitDC(sql, (result) => {
          resole(result);
        });
      });
    }
    function constExcel(quota, json) {
      return new Promise((resolve, reject) => {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Customers");
        let sheetDC = [
          { header: "ID", key: "M_PRODUCT_ID", width: 30 },
          { header: "Produits", key: "NAME", width: 50 },
          { header: "QTS", key: "QUANTITY", width: 10 },
          { header: "isShared", width: 10 },
          { header: "qtyPartager", width: 10 },
          { header: "isColor", width: 10 },
        ];
        let sheetOper = [
          { header: "ID", key: "M_PRODUCT_ID", width: 30 },
          { header: "Produits", key: "NAME", width: 50 },
          { header: "QTS", key: "QUANTITY", width: 10 },
        ];
        worksheet.columns = json.hasOwnProperty("id_svc") ? sheetOper : sheetDC;
        // Add Array Rows
        worksheet.addRows(quota);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=" + `quota_${datea()}.xlsx`);
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      });
    }
  },
};

function datea() {
  var today = new Date();
  var dd = today.getDate();
  var yy = today.getFullYear();
  var mm = today.getMonth() + 1;
  return dd + "/" + mm + "/" + yy;
}
function dateOracle() {
  var today = new Date();
  var dd = today.getDate();
  var yy = today.getFullYear();
  var mm = today.getMonth() + 1;
  return yy + "/" + mm + "/" + dd;
}
function sysDate() {
  var today = new Date();
  return today;
}
function heure() {
  var today = new Date();
  var hh = today.getHours();
  var mm = today.getMinutes();
  return hh + ":" + mm;
}
