const tabTiers = require("../../models/tabTiers");
const tabDemandeDebloque = require("../../models/tabDemandeDebloque");
const tabClientDebloque = require("../../models/tabClientDebloque");
const tabNclient = require("../../models/tabNclients");
const tabCorder = require("../../models/tabCorder");
const tabXxbonRoute = require("../../models/tabXx_bonRoute");
const { getUpdatedOperationType, StatutProsper, getValide, getReafecteA } = require("../Functions");
const CPBartnerRepository = require("../../repositories/CBPartnerRepository");

const ValidationStatus = {
  VALIDATE: 1,
  NOT_VALIDATE: 0,
};

module.exports = {
  getClientOperr: (req, res) => {
    try {
      tabTiers.clientParOper(req.body, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getClientProsp: (req, res) => {
    try {
      tabTiers.clientProsp(req.body, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  deploqueClient: async (req, res) => {
    try {
      const { user_id, bpartner_id, id_org, indiceOper, balance, prosper, isSeuil } = req.body;

      const currentDate = date();
      const currentTime = heure();

      let sql = `select * from demandedeploque where bpartner_id=${bpartner_id} and user_id=${user_id} and dateCreation='${currentDate}' and supp=0`;
      const existingResponse = await tabDemandeDebloque.selectFeaturePromise(sql);

      if (existingResponse.length != 0) return res.status(200).send(false);

      const clientRequest = {
        id_org: parseInt(id_org),
        id_Client: parseInt(bpartner_id),
        dt: dateOracle(),
      };

      const clientResponse = await tabTiers.donnerClientDebloque(clientRequest);
      if (clientResponse.length == 0) return res.status(200).send(false);

      const clientInfo = clientResponse[0];
      const {
        NAME: bpartnerName,
        C_SALESREGION_ID: bpartnerRegionId,
        NAMEREGION: bpartnerRegionName,
        XX_RECSUPERVISOR_ID: supervisorId,
        NAMESVR: supervisorName,
        SOCREDITSTATUS: bpStatus,
        NAMELASTOPER: bpLastOperation,
        XX_LASTSALES: lastSales,
        PHONE: phone,
        PHONE_1: phone1,
        C_BP_STATUS_ID: clientStatusId,
      } = clientInfo;

      const lastCommande = lastSales ? dateOracle11(lastSales) : null;
      const clientExcellent = clientStatusId ? "Y" : "N";
      const telephone = `${phone}/${phone1}`;

      const newRequest = {
        id_org,
        indiceOper,
        user_id,
        bpartner_id,
        bpartner_name: bpartnerName,
        bpartner_status: bpStatus,
        region: bpartnerRegionName,
        id_region: bpartnerRegionId,
        superViseurRegion: supervisorId,
        superViseurName: supervisorName,
        balance,
        numTelephone: telephone,
        prosper,
        bp_lastOper: bpLastOperation,
        lastCommande,
        dateCreation: currentDate,
        timeCreation: currentTime,
        clientExcellent,
        zcreditMessage: clientInfo.ZCREDITMESSAGE,
        isSeuil,
        isBalance: isSeuil,
      };
      // insert data;
      var isInserted = await tabDemandeDebloque.insert(newRequest);
      isInserted.affectedRows == 1 ? res.status(200).send(true) : res.status(200).send(false);
    } catch (error) {
      console.error("Error in deploqueClient:", error);
      return res.status(500).send("Internal Server Error");
    }
  },
  suppDemandeDeploque: (req, res) => {
    try {
      let json = {
        indice: 0,
        idDemDep: req.body.idDemDep,
        user_id: req.body.id_user,
      };
      tabDemandeDebloque.delete(json);
      listeDemandeDebloquage(req.body.id_user, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  listeDemandeDeploque: (req, res) => {
    try {
      listeDemandeDebloquage(req.body.id_user, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getListeClientUnblocked: async (req, res) => {
    try {
      const { id_user, id_org, role } = req.body;
      let sql = `select  *, DATE_FORMAT(dateCreation, '%Y-%m-%d') AS dateCreation from demandedeploque where valide='N' and dateCreation='${date()}' and prosper IN (0, 2, 3) and supp=0 and isSeuil='N'`;
      if (id_org != 0)
        sql = `select *, DATE_FORMAT(dateCreation, '%Y-%m-%d') AS dateCreation from demandedeploque where superViseurRegion=${id_user} and valide='N' and isSeuil='N' and dateCreation='${date()}' and prosper IN (0, 2, 3) and supp=0`;
      if (role == 13)
        sql = `select *, DATE_FORMAT(dateCreation, '%Y-%m-%d') AS dateCreation from demandedeploque where valide='N' and dateCreation='${date()}' and prosper IN (3) and supp=0 and isSeuil='N'`;
      const result = await tabDemandeDebloque.selectPromise(sql);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  selectClientUnblocked: (req, res) => {
    try {
      let json = { indice: 1, idDemDep: req.body.idDemDep };
      tabDemandeDebloque.select(json, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  selectInfoClient(req, res) {
    try {
      runSelectInfoClient();
      async function runSelectInfoClient() {
        let orderClient = await runOrderClient();
        let dateAndJour = await runDateAndJour();
        let payement = await runPaiment();
        let countInvoice = await runCountInvoice();
        let coordonner = await runCoordonner();
        let balanceTiers = await runBalanceTiers();
        let json = {
          encours: orderClient,
          dateCreation: dateAndJour.dateCreation,
          payement: payement.length,
          day: dateAndJour.day,
          ans: dateAndJour.ans,
          payementAmt: payement,
          countInvoice: countInvoice[0][0],
          balance: balanceTiers,
          coordonner: coordonner,
        };
        res.status(200).send(json);
      }
      function runCoordonner() {
        return new Promise((resolve, reject) => {
          let json1 = {
            c_bpartner_id: req.body.c_bpartner_id,
            ad_org_id: req.body.ad_org_id,
          };
          tabTiers.coordonner(json1, (coordonner) => {
            resolve(coordonner);
          });
        });
      }
      function runBalanceTiers() {
        return new Promise((resolve, reject) => {
          tabTiers.balanceTiers(req.body.c_bpartner_id, (balance) => {
            resolve(balance);
          });
        });
      }
      function runCountInvoice() {
        return new Promise((resolve, reject) => {
          let json = {
            c_bpartner_id: req.body.c_bpartner_id,
            ad_org_id: req.body.ad_org_id,
          };
          tabTiers.countInvoice(json, (countInvoice) => {
            resolve(countInvoice);
          });
        });
      }
      function runPaiment() {
        return new Promise((resolve, reject) => {
          let json = { c_bpartner_id: req.body.c_bpartner_id };
          tabTiers.paiement(json, (payement) => {
            resolve(payement);
          });
        });
      }
      function runDateAndJour() {
        return new Promise((resolve, reject) => {
          let json1 = {
            c_bpartner_id: req.body.c_bpartner_id,
            ad_org_id: req.body.ad_org_id,
          };
          tabTiers.selectClient(json1, (dateCreation) => {
            let nbrCreation = dateDiff(dateCreation[0][0], sysDate());
            let ans1 = nbrCreation.day / 365;
            let ans = parseInt(ans1);
            let day = parseFloat(ans1 - ans).toFixed(2) * 100;
            resolve({ dateCreation, ans, day });
          });
        });
      }
      function runOrderClient() {
        return new Promise((resolve, reject) => {
          let json = {
            idClient: req.body.c_bpartner_id,
            dt: dateOracle(),
            ad_org_id: req.body.ad_org_id,
          };
          tabCorder.findAll1(json, (encours) => {
            resolve(encours);
          });
        });
      }
    } catch (error) {
      res.status(404).send(error);
    }
  },
  actionClientUnblocked: async (req, res) => {
    const {
      indiceOperOper,
      id_user,
      idDemDeploque,
      operationType,
      description,
      indice_user,
      reafecterA,
      idReafecterA,
      organisationReafectA,
    } = req.body;
    const demandeLine = await tabDemandeDebloque.FindDemendeDeploqueById({
      idDemDep: idDemDeploque,
    });
    const prospect = demandeLine[0].prosper;
    const c_bpartner_id = demandeLine[0].bpartner_id; // client

    const json = {
      status: "O",
      salesrep_id: idReafecterA,
      ad_org_id: parseInt(organisationReafectA),
      c_bpartner_id: c_bpartner_id,
      updatedby: parseInt(id_user),
    };

    if (operationType == StatutProsper.CLIENT_PROSPECT_COMMAND_VALIDE) {
      await tabDemandeDebloque.updateProspect(
        StatutProsper.CLIENT_PROSPECT_COMMAND_VALIDE,
        indiceOperOper,
        id_user,
        idDemDeploque
      );
      let json11 = {
        idSuperViseur: req.body.id_user,
        dateCreation: date(),
      };
      await tabTiers.debloqClient(json);
      const list = await tabClientDebloque.GetClientFromUnlocked(json11);
      const listSeuil = await tabClientDebloque.GetListClientSeuilToday(json11);
      const response = listSeuil.concat(list);
      res.status(200).send(response);
      return;
    }

    const getOperation = await getUpdatedOperationType(operationType, prospect);

    if (getOperation == "DR") {
      await tabTiers.debloqClientPros(json);
    }

    if (getOperation == "Y") {
      await tabTiers.debloqClient(json);
    }

    const dataInsert = {
      indice: 0,
      idDemDep: idDemDeploque,
      typeOperation: getOperation,
      description: description,
      demandeReafectPar: reafecterA,
      reafecterPar: indice_user,
      reafecterA: reafecterA,
      id_user: id_user,
      dateCreation: date(),
      timeCreation: heure(),
      creePar: indice_user,
    };
    await tabClientDebloque.insert(dataInsert);

    const dataUpdateValide = {
      valide: getValide(getOperation),
      description: req.body.description,
      modifyBy: indice_user,
      idDemdep: req.body.idDemDeploque,
    };
    await tabDemandeDebloque.UpdateValide(dataUpdateValide);

    let json10 = {
      idSuperViseur: req.body.id_user,
      reafecterA: req.body.reafecterA,
      dateCreation: date(),
    };
    const list = await tabClientDebloque.GetClientFromUnlocked(json10);
    const listSeuil = await tabClientDebloque.GetListClientSeuilToday(json10);
    const response = listSeuil.concat(list);
    res.status(200).send(response);
  },
  tableDebloqueAuj: async (req, res) => {
    try {
      if (req.body.rolesId == 13) {
        const json = {
          modifyBy: req.body.id_user,
          dateCreation: date(),
        };
        const listValid = await tabClientDebloque.GetListClientCommandValide(json);
        res.status(200).send(listValid);
        return;
      }
      let json11 = {
        idSuperViseur: req.body.id_user,
        dateCreation: date(),
      };
      let list = await tabClientDebloque.GetClientFromUnlocked(json11);
      let listSeuil = await tabClientDebloque.GetListClientSeuilToday(json11);
      let response = listSeuil.concat(list);
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  annulerDebloque: async (req, res) => {
    const { idClientDebloque, indiceOper, idDemDep, id_user } = req.body;
    try {
      let json13 = {
        indice: 1,
        modifierPar: indiceOper,
        dateModif: date(),
        timeModif: heure(),
        idClientDebloque: idClientDebloque,
      };
      tabClientDebloque.update(json13);
      let json14 = {
        indice: 11,
        modifyBy: req.body.indiceOper,
        idDemDep: req.body.idDemDep,
      };
      tabDemandeDebloque.update(json14);

      const demandeLine = await tabDemandeDebloque.FindDemendeDeploqueById({
        idDemDep,
      });
      const reafecterA = demandeLine[0].prosper >= 2 ? getReafecteA(demandeLine[0].id_org) : demandeLine[0].user_id; // operateur ID;
      const dataUpdateClient = {
        salesrep_id: reafecterA,
        status: "S",
        ad_org_id: demandeLine[0].id_org,
        c_bpartner_id: demandeLine[0].bpartner_id,
        updatedby: id_user,
      };
      await tabTiers.debloqClientPros(dataUpdateClient);
      // let sql = `update C_BP_Share set DATE_SORTIE_PROS=''
      // where c_bpartner_id=${demandeLine[0].bpartner_id} and ad_org_id=${demandeLine[0].id_org}`;
      // tabTiers.updateFeature(sql, (reponse) => {
      // });
      const json = {
        idSuperViseur: req.body.id_user,
        dateCreation: date(),
      };
      const list = await tabClientDebloque.GetClientFromUnlocked(json);
      const listSeuil = await tabClientDebloque.GetListClientSeuilToday(json);
      const response = listSeuil.concat(list);
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  vueRecouv: async (req, res) => {
    try {
      const { ad_org, dateCreation1, dateCreation2, id_user } = req.body;
      const opers = await tabDemandeDebloque.FindOperBySVC(id_user);
      const opersIds = opers.map((e) => e.ad_user_id).join(",");
      const json = {
        id_user,
        opersIds,
        id_org: ad_org,
        dateCreation1: dateCreation1 == "" ? date() : dateCreation1,
        dateCreation2: dateCreation2 == "" ? date() : dateCreation2,
      };
      const response = await tabDemandeDebloque.FindRecouvBySVC(json);
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  validProspectToUnlocked: async (req, res) => {
    const { idDemDep, isValidate } = req.body;
    const demDepLine = await tabDemandeDebloque.FindDemendeDeploqueById({
      idDemDep,
    });
    if (demDepLine.length == 0) {
      return res.status(404).send({ message: "line not found" });
    }
    const venteGeleeData = {
      tempSalesRep: demDepLine[0].user_id, // operateur
      adOrgId: demDepLine[0].id_org,
      cBPartnerId: demDepLine[0].bpartner_id,
    };
    let sql = `update demandedeploque set prosper = ${StatutProsper.CLIENT_PROSPECT_VALIDE} where idDemDep=${idDemDep}`;
    if (isValidate == ValidationStatus.NOT_VALIDATE) {
      sql = `update demandedeploque set prosper = ${StatutProsper.CLIENT_PROSPECT_NOT_VALIDE} where idDemDep=${idDemDep}`;
      await CPBartnerRepository.UpdateClientToVenteGelee(venteGeleeData);
    }
    await tabDemandeDebloque.updatePromise(sql);
    res.status(200).send({ message: "ok" });
  },
  vueRecouv1: (req, res) => {
    let ad_org = req.body.ad_org,
      id_user = req.body.id_user,
      dateCreation1 = req.body.dateCreation1,
      dateCreation2 = req.body.dateCreation2;
    if (ad_org != 0) {
      recouv11(221);
    } else if (ad_org == 0) {
      recouv11(2211);
    }
    function recouv11(indice1) {
      if (dateCreation1 == "" && dateCreation2 == "") {
        let json4 = {
          indice: indice1,
          dateCreation1: date(),
          dateCreation2: date(),
          id_user: id_user,
        };
        tabClientDebloque.select(json4, async (reponse) => {
          let data = await reponse;
          res.status(200).send(data);
        });
      } else if (dateCreation1 != "" && dateCreation2 != "") {
        let json21 = {
          indice: indice1,
          dateCreation1: dateCreation1,
          dateCreation2: dateCreation2,
          id_user: id_user,
        };
        tabClientDebloque.select(json21, async (reponse) => {
          let data = await reponse;
          res.status(200).send(data);
        });
      }
    }
  },
  listeNvClientRecouv: (req, res) => {
    try {
      let json13 = { indice: 0, valide: "S" };
      tabNclient.select(json13, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  listeNvClientRecouv1: (e, cb) => {
    let json13 = {
      indice: 3,
      valide: e.valide,
      ad_org: e.ad_org,
      ad_org1: 1000517,
    };
    tabNclient.select(json13, (reponse) => {
      cb(reponse);
    });
  },
  selectClientNV: (req, res) => {
    try {
      let json14 = { indice: 1, idClient: parseInt(req.body.idClient) };
      tabNclient.select(json14, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  validerClient: (req, res) => {
    try {
      let json15 = {
        indice: 1,
        idClient: req.body.idClient,
        mdp: req.body.mdp,
        indiceOper: req.body.indiceOper,
        valide: "R",
        region: req.body.region,
        dateSVR: sysDate(),
        nomClient: req.body.nomClient,
        adresse: req.body.adresse,
      };
      tabNclient.update(json15);
      res.status(200).send("update");
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getRegionSV: (req, res) => {
    let id_svr = req.body.id_user;
    let json = { id_svr: id_svr };
    tabXxbonRoute.selectRegoin(json, (reponse) => {
      res.send(reponse);
    });
  },
  getLivreur: (req, res) => {
    let id_svr = req.body.id_user;
    let json = {
      variable: `distinct name,C_BPARTNER_ID `,
      value: `SV_R_ID=${id_svr}`,
    };
    tabXxbonRoute.selectLivreur(json, (reponse) => {
      res.send(reponse);
    });
  },
  getBonRoute: (req, res) => {
    let json = {
      variable: `distinct documentno , to_char("created"),ORGANISATION`,
      value: `C_BPARTNER_ID=${req.body.id_livreur} order by documentno desc`,
    };
    tabXxbonRoute.selectLivreur(json, (reponse) => {
      res.send(reponse);
    });
  },
  detailBonRoute: (req, res) => {
    let json = { documentno: req.body.documentno };
    tabXxbonRoute.detailBonRoute(json, (reponse) => {
      res.send(reponse);
    });
  },
  excellentClient: (req, res) => {
    let ex = req.body.excellent;
    if (ex == "") ex = null;
    let json = {
      set: `set C_BP_Status_ID=${ex} `,
      where: `where C_BPartner_ID=${req.body.c_bpartner_id}`,
    };
    tabTiers.updateTiers(json, (reponse) => {
      res.send({ reponse: reponse });
    });
  },
  getListClientExcellent: (req, res) => {
    let json = {
      indice: 2,
      C_BP_Status_ID: 1000005,
      XX_RECSUPERVISOR_ID: req.body.id_user,
    };
    tabTiers.select(json, (reponse) => {
      res.send(reponse);
    });
  },
  demandeNouveauSeuil: (req, res) => {
    runDemandeeNouveauSeuil();
    async function runDemandeeNouveauSeuil() {
      let updateClientDebloque = await runUpdateClientDebloque(req.body.idDemDep, "Y");
      let updatDemandeDebloque = await runUpdatDemandeDebloque(req.body.idDemDep, "Y");
      res.send({ reponse: updatDemandeDebloque });
    }
  },
  modifierSeuilClient: (req, res) => {
    runModifierSeuilClient();
    async function runModifierSeuilClient() {
      let getDemande = await runGetDemande(req.body.idDemDep);
      let getInformationClient = await runGetInformationClient(getDemande[0].id_org, getDemande[0].bpartner_id);
      res.send(getInformationClient);
    }
    function runGetInformationClient(ad_org_id, c_bpartner_id) {
      return new Promise((resolve, reject) => {
        let sql = `select AD_ORG_ID,C_BPARTNER_ID,SO_CREDITLIMIT,TOTALOPENBALANCE from C_BP_Share where ad_org_id=${ad_org_id} and c_bpartner_id=${c_bpartner_id} and isactive='Y'`;
        tabTiers.selectFeature(sql, (reponse) => {
          resolve(reponse);
        });
      });
    }
    function runGetDemande(idDemDep) {
      return new Promise((resolve, reject) => {
        let json = { indice: 1, idDemDep };
        tabDemandeDebloque.select(json, (reponse) => {
          resolve(reponse);
        });
      });
    }
  },
  majBalance: (req, res) => {
    runMajBalance();
    async function runMajBalance() {
      let majCbpShare = await runMajCbpShare();
      let updateClientDebloque = await runUpdateClientDebloque(req.body.idDemDep, "OK");
      let updatDemandeDebloque = await runUpdatDemandeDebloque(req.body.idDemDep, "OK");
      res.send({ reponse: majCbpShare });
    }
    function runMajCbpShare() {
      return new Promise((resolve, reject) => {
        let sql = `update C_BP_Share set SO_CREDITLIMIT=${req.body.seuil}
            where ad_org_id=${req.body.ad_org_id} and C_BPartner_ID=${req.body.c_bpartner_id}`;
        tabTiers.updateTiersFeature(sql, (reponse) => {
          resolve(reponse);
        });
      });
    }
  },
};
function runUpdateClientDebloque(idDemDep, action) {
  return new Promise((resolve, reject) => {
    let sql = `update clientdebloque set isBalance="${action}" where idDemDep=${idDemDep} and supp=0`;
    tabClientDebloque.updateFeature(sql, (reponse) => {
      resolve(reponse.affectedRows);
    });
  });
}

function runUpdatDemandeDebloque(idDemDep, action) {
  return new Promise((resolve, reject) => {
    let sql = `update demandedeploque set isBalance="${action}" where idDemDep= ${idDemDep} and supp=0`;
    tabClientDebloque.updateFeature(sql, (reponse) => {
      resolve(reponse.affectedRows);
    });
  });
}
function date() {
  var now = new Date();
  var dd = now.getDate();
  var yy = now.getFullYear();
  var mm = now.getMonth() + 1;
  return yy + "/" + mm + "/" + dd;
}

function listeDemandeDebloquage(user_id, cb) {
  let json1 = `select * from demandedeploque where user_id=${user_id} and dateCreation='${date()}' and supp=0 order by idDemDep desc`;
  tabDemandeDebloque.selectFeature(json1, (reponse) => {
    cb(reponse);
  });
}

function listeDemandeDebloquagePromise(user_id) {
  return new Promise((resolve, reject) => {
    let json1 = `select * from demandedeploque where user_id=${user_id} and dateCreation='${date()}' and supp=0 order by idDemDep desc`;
    tabDemandeDebloque.selectFeature(json1, (reponse) => {
      resolve(reponse);
    });
  });
}
function dateOracle() {
  var now = new Date();
  var dd = now.getDate();
  var yy = now.getFullYear();
  var mm = now.getMonth() + 1;
  return dd + "/" + mm + "/" + yy;
}

function dateOracle11(dt) {
  var dd = dt.getDate();
  var yy = dt.getFullYear();
  var mm = dt.getMonth() + 1;
  return yy + "/" + mm + "/" + dd;
}
function heure() {
  var today = new Date();
  var hh = today.getHours();
  var mm = today.getMinutes();
  return hh + ":" + mm;
}
function dateNow() {
  var today = new Date();
  return today;
}
function sysDate() {
  var now = new Date();
  return now;
}
function dateDiff(date1, date2) {
  var diff = {}; // Initialisation du retour
  var tmp = date2 - date1;

  tmp = Math.floor(tmp / 1000); // Nombre de secondes entre les 2 dates
  diff.sec = tmp % 60; // Extraction du nombre de secondes

  tmp = Math.floor((tmp - diff.sec) / 60); // Nombre de minutes (partie entière)
  diff.min = tmp % 60; // Extraction du nombre de minutes

  tmp = Math.floor((tmp - diff.min) / 60); // Nombre d'heures (entières)
  diff.hour = tmp % 24; // Extraction du nombre d'heures

  tmp = Math.floor((tmp - diff.hour) / 24); // Nombre de jours restants
  diff.day = tmp;

  return diff;
}
