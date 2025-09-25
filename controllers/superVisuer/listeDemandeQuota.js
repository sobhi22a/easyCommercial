const tabCorder = require("../../models/tabCorder");
const tabXx_quotaRef = require("../../models/tabXx_quotaRef");
const tabXx_quota = require("../../models/tabXx_quota");
const tabXx_quota1 = require("../../models/tabXx_quota1");
const XxQuotaRepository = require("../../repositories/XxQuotaRepository");

module.exports = {
  listeDemandeQuota: async (req, res) => {
    try {
      let listDemandeNonCondition = await getListDemandeNonCondition('N');
      let listDemandeCondition = await getListDemandeNonCondition('Y');
      let sommeDemande = [{sommeDemande: listDemandeNonCondition.length + listDemandeCondition.length}]
      res.status(200).send({ listDemande: listDemandeNonCondition,listDemandeCondition, sommeDemande });

      function getListDemandeNonCondition(isCondition) {
        return new Promise((resolve, reject) => {
          let sql = `SELECT DISTINCT reference,nomTiers,STATUS,createby,modifierDC,dateTraiter FROM xx_quotaref  
            WHERE id_svc=${req.body.ad_use_id}
            AND traiter='Y' 
            AND confirme='N' 
            AND isCondition='${isCondition}' 
            AND dateCreation='${dateOracl()}' 
            ORDER BY dateTraiter`;
        tabXx_quotaRef.featuresSelect(sql, (result) => {
          resolve(result);
        });
      });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },

  listeBccDemander: async (req, res) => {
    let sql = `select c_order_id,documentno from xx_quotaref 
      where reference='${req.body.reference}' 
      and dateCreation='${dateOracl()}'`;
    // let nbrCommandSql = `SELECT COUNT(DISTINCT reference) nbrCommande FROM xx_quotaref
    //     WHERE ad_user_id = (SELECT ad_user_id FROM xx_quotaref WHERE reference = '${parseInt(req.body.reference)}') 
    //     AND traiter = 'Y' AND confirme = 'N' AND dateCreation = '${dateOracl()}'`;
    // const nbrCommande = await tabXx_quota1.select(nbrCommandSql);
    tabXx_quotaRef.featuresSelect(sql, (liste) => {
      let idBccListe;
      for (let i = 0; i < liste.length; i++) {
        if (i == 0) {
          idBccListe = liste[0].c_order_id;
          idBccListe = idBccListe.toString();
        } else if (i > 0) {
          idBccListe = idBccListe + "," + liste[i].c_order_id;
        }
      }
      idBccListe = "(" + idBccListe + ")";
      tabCorder.mntBcc(idBccListe, (mnt) => {
        res.status(200).send({ liste, mntBcc: mnt, nbrCommandeOper:  0});
      });
    });
  },
  getProduitBcc: (req, res) => {
    runGetProduitBcc();
    async function runGetProduitBcc() {
      let reponse1 = await findLineBcc(req.body.c_order_id);
      let mntOrdre1 = await mntCorderBcc(req.body.c_order_id);
      let values = await findLineBccCtx(req.body.c_order_id);
      let json9 = { reponse1, mntOrdre1, values };
      res.send(json9);
    }
    function findLineBcc(c_order_id) {
      return new Promise((resolve, reject) => {
        tabCorder.findLine(c_order_id, async (reponse) => {
          resolve(reponse);
        });
      });
    }
    function findLineBccCtx(c_order_id) {
      return new Promise((resolve, reject) => {
        tabCorder.findLineCtx(c_order_id, async (reponse) => {
          resolve(reponse);
        });
      });
    }
    function mntCorderBcc(c_order_id) {
      return new Promise((resolve, reject) => {
        tabCorder.mntCorder(c_order_id, async (mntOrdre) => {
          resolve(mntOrdre);
        });
      });
    }
  },
  getUgVenteFlashParProduit: (req, res) => {
    tabCorder.findByVFproduit(req.body.m_product_id, (reponse) => {
      res.send(reponse);
    });
  },
  getVenteFlashListe: (req, res) => {
    runVF();
    async function runVF() {
      let vf = await runGetlisteVF();
      let vfJson = await getJson(vf);
      res.send(vfJson);
    }
    function runGetlisteVF() {
      return new Promise((resolve, reject) => {
        tabCorder.findByVenteFlash((reponse) => {
          resolve(reponse);
        });
      });
    }
    function getJson(vf) {
      var ugVF, ugN, name;
      var jsonArr = [];
      return new Promise((resolve, reject) => {
        for (var i = 0; i < vf.length; i++) {
          let ugN1 = vf[i][2];
          if (ugN1 == null) {
            ugN1 = 0;
          }
          name = vf[i][0];
          ugVF = vf[i][1];
          ugN = ugN1;
          id = vf[i][3];
          let jsonA = { name: name, ugVF: ugVF, ugN: ugN };
          jsonArr.push(jsonA);
        }
        resolve(jsonArr);
      });
    }
  },

  getProduitQuotaClient: (req, res) => {
    try {
      runGetProduitQuotaClient();
      async function runGetProduitQuotaClient() {
        let list = await runGetList();
        let sommeColor = await runSommeColor();
        res.status(200).send({ list, sommeColor });
      }
      function runSommeColor() {
        return new Promise((resolve, reject) => {
          let json = `SELECT sum(q.qtyallocated) as qtyallocated,q.color
            from xx_quota q where q.reference=${req.body.reference} 
            group by q.color order by q.color`;
          tabXx_quota.selectAll(json, (reponse) => {
            resolve(reponse);
          });
        });
      }
      function runGetList() {
        return new Promise((resolve, reject) => {
          let json = {
            indice: 12,
            reference: req.body.reference,
            ad_org_id: req.body.ad_org_id,
          };
          tabXx_quota.select(json, (reponse) => {
            resolve(reponse);
          });
        });
      }
    } catch (error) {
      res.status(404).send(error);
    }
  },

  getProduitModifier: (req, res) => {
    let json = { indice: 8, xx_quota_id: req.body.xx_quota_id };
    tabXx_quota.select(json, (repp) => {
      res.send(repp);
    });
  },

  confirmerQuotaFinal: (req, res) => {
    let sql = `update xx_quotaref set confirme="Y",dateConfirme='${sysDate1()}' where reference='${req.body.reference}' and traiter="Y"`
    tabXx_quotaRef.featuresUpdate(sql, (reponse) => {
      reponse >= 1 && res.status(200).send({ message: "ok" })
    })
  },

  confirmerQuotaFinalTT: async (req, res) => {
    // Update all line of product quota reference
    await XxQuotaRepository.ModifyAllProductQuotaBySVAsync(req.body.reference, req.body.id_dc);
    let sql1 = `update xx_quotaref set confirme="Y",dateConfirme='${sysDate1()}' where reference='${req.body.reference}' and traiter="Y"`;
    let response = await tabXx_quotaRef.featuresPromise(sql1);
    if (response >= 1) {
      let sql = `update xx_quota set 
        quantity=qtyallocated, 
        updatedby = ${req.body.id_dc} 
        where reference = '${req.body.reference}' and updatedby=0 `;
      tabXx_quota1.updateFeature(sql,(repp) => {});
      res.status(200).send({message: "ok"});
    }    
  },

  comandeApprouver: (req, res) => {
    let sql = `select distinct reference, nomTiers,createby,ad_org_id,
            DATE_FORMAT(dateCreation,'%Y-%m-%d') as dateCreation,timeCreation 
            from xx_quotaref 
            where dateCreation='${dateOracl()}' 
            and confirme='${req.body.confirme}' 
            and traiter='${req.body.traiter}'`;
    tabXx_quotaRef.featuresSelect(sql, (reponse) => {
      res.send(reponse);
    });
  },
};

function date() {
  var now = new Date();
  var dd = now.getDate();
  var yy = now.getFullYear();
  var mm = now.getMonth() + 1;
  return dd + "/" + mm + "/" + yy;
}
function dateOracl() {
  var now = new Date();
  var dd = now.getDate();
  var yy = now.getFullYear();
  var mm = now.getMonth() + 1;
  return yy + "/" + mm + "/" + dd;
}
function dateOracl1() {
  var now = new Date();
  var dd = now.getDate() + 1;
  var yy = now.getFullYear();
  var mm = now.getMonth() + 1;
  return yy + "/" + mm + "/" + dd;
}
function sysDate() {
  var now = new Date();
  return now;
}
function heure() {
  var today = new Date();
  var hh = today.getHours();
  var mm = today.getMinutes();
  return hh + ":" + mm;
}

function sysDate1() {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Add 1 to month because it's zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
  return formattedDate;
}
