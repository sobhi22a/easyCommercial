const tabXx_quota = require("../../models/tabXx_quota");
const stock = require("../../models/wana_analyse_stock_att");
const tabXx_quota1 = require("../../models/tabXx_quota1");
const tabConditions = require("../../models/tabConditions");
const Articles = require("../../models/transfer/tabArticles");

module.exports = {
  renouvelerStock: (req, res) => {
    runRenouvelerStock();
    async function runRenouvelerStock() {
      try {
        await runDeleteXXquota();
        const deleteConditionSql = `DELETE FROM conditions`;
        const deleteConsitions = await tabConditions.delete(deleteConditionSql);
        let selectProduct = await runSelectProduct();
        await runInsertProduct(selectProduct);
        res.status(200).send({result: 'ok'})
      } catch (error) {
        res.status(400).send({message: 'erreur leur de creation', result: error})
      }
    }
    function runInsertProduct(product) {
      var ii = 0;
      return new Promise((resolve, reject) => {
        for (var i = 0; i < product.length; i++) {
          ii++;
          let jsonInsert = {
            ad_org_id: 0,
            m_product_id: parseInt(product[i][1]),
            ad_user_id: req.body.ad_user_id,
            quantity: parseInt(product[i][2]),
            qtyordered: 0,
            percentage: 0,
          };
          stock.insert(jsonInsert, (repp) => {});
        }
        resolve({ compte: ii, nbrProduct: product.length });
      });
    }
    function runSelectProduct() {
      return new Promise((resolve, reject) => {
        stock.selectProduct((reponse) => {
          resolve(reponse);
        });
      });
    }
    function runDeleteXXquota() {
      return new Promise((resolve, reject) => {
        stock.delete((repDell) => {
          resolve(repDell);
        });
      });
    }
  },
  getProductsRestore: async (req, res) => {
    try {
      const sql = `select distinct m_product_id,name,isRestor from xx_quota 
      where created='${req.body.date}' and name LIKE '%${req.body.name}%'`;
      const result = await tabXx_quota1.select(sql);
      res.status(200).send(result);
    } catch (error) {
      throw error;
    }
  },
  restaurerProduits: (req, res) => {
    runRestaurerProduits();
    async function runRestaurerProduits() {
      let listProduct = await getListeProduct(req.body.m_product_id, req.body.date);
      for (var i = 0; i < listProduct.length; i++) {
        let inset11 = await restaureProduit(listProduct[i]);
        const update = `update xx_quota set isRestor = 1 
        where m_product_id=${req.body.m_product_id} and created='${req.body.date}'`;
        const resultUpdate = inset11 == 1 && tabXx_quota1.update(update);
      }
      res.send({result: 'OK'})
    }
    function getListeProduct(m_product_id, date) {
      return new Promise(async (resolve, reject) => {
        const sql = `select * from xx_quota where created='${date}' and m_product_id=${m_product_id}`
        const reponse = await tabXx_quota1.select(sql);
        resolve(reponse);
      });
    }
    function restaureProduit(list) {
      return new Promise((resolve, reject) => {
          tabXx_quota.insert11(list, (reponse) => {
            resolve(reponse);
          });
      });
    }
  },
  produitPartager: (req, res) => {
    let dataSvc = JSON.parse(req.body.jsonSvc);
    let data = JSON.parse(req.body.data);
    runProduitPartager();
    async function runProduitPartager() {
      let m_product_id = await getMproductId(data[0].xx_quota_id);
      let insert = await boucleSVC(m_product_id);
      res.send("ok");
    }
    function boucleSVC(m_product_id) {
      return new Promise((resolve, reject) => {
        for (const i of dataSvc) {
          let qty =
            data[0].qtyPartager == "" ? data[0].qtyGlobal : data[0].qtyPartager;
          qty = qty * (i.pourcentage / 100);
          let jsonI = {
            m_product_id: m_product_id,
            ad_user_id: i.ad_user_id,
            ad_org_id: i.ad_org_id,
            quantity: qty,
            qtyordered: qty,
          };
          resolve("ok");
          runInsertProductPartage(jsonI);
        }
      });
    }
    function runInsertProductPartage(e) {
      return new Promise((resolve, reject) => {
        let jsonInsert = {
          ad_org_id: 0,
          m_product_id: e.m_product_id,
          ad_user_id: e.ad_user_id, //createdby
          quantity: parseInt(e.quantity),
          qtyordered: parseInt(e.qtyordered),
          percentage: 0,
        };
        stock.insert(jsonInsert, (repp) => {
          resolve(repp);
        });
      });
    }
  },
  produitPartagerGlobale: (req, res) => {
    var dataSvc = JSON.parse(req.body.jsonSvc);
    let data = JSON.parse(req.body.data);
    runProduitPartagerGlobale();
    async function runProduitPartagerGlobale() {
      // product No Shared
      for (var i = 0; i < data.length; i++) {
        if (!data[i].hasOwnProperty("isShared")) {
          data[i].hasOwnProperty("qtyPartager") == true
            ? await updateQuantityXxQuota(data[i].qtyPartager, data[i].ID, data[i].isColor)
            : await updateQuantityXxQuota(data[i].QTS, data[i].ID, data[i].isColor);
        } else {
          await boucleSVCGlobal(data[i]);
        }
      }
      res.status(200).send('ok');
    }
    function updateQuantityXxQuota(qty, m_product_id, isColor) {
      return new Promise((resolve, reject) => {
        let percentage = isColor === 1 ? 1 : 0;
        let sql = `update xx_quota set qtyordered=${qty}, percentage=${percentage} where m_product_id=${m_product_id}`;
        tabXx_quota.featureUpdate(sql, (reponse) => {
          resolve(reponse);
        });
      });
    }
    function boucleSVCGlobal(data) {
      return new Promise((resolve, reject) => {
        for (const i of dataSvc) {
          let qty =
            data.hasOwnProperty("qtyPartager") == true
              ? data.qtyPartager
              : data.QTS;

          qty = qty * (i.pourcentage / 100);
          let jsonI = {
            m_product_id: data.ID,
            ad_user_id: i.ad_user_id,
            ad_org_id: i.ad_org_id,
            quantity: qty,
            qtyordered: qty,
            isColor: data.hasOwnProperty("isColor") == true ? data.isColor : 0
          };
          resolve("ok");
          runInsertProductPartageGlobal(jsonI);
        }
      });
    }
    function runInsertProductPartageGlobal(e) {
      return new Promise((resolve, reject) => {
        let jsonInsert = {
          ad_org_id: 0,
          m_product_id: e.m_product_id,
          ad_user_id: e.ad_user_id, //createdby
          quantity: parseInt(e.quantity),
          qtyordered: parseInt(e.qtyordered),
          percentage: e.isColor,
        };
        stock.insert(jsonInsert, (repp) => {
          resolve(repp);
        });
      });
    }
  },
  ajouterQteMax: (req, res) => {
    runAjouterQteMax();
    async function runAjouterQteMax() {
      let m_product_id = await getMproductId(req.body.xx_quota_id);
      let existe = await existeCondition11(m_product_id);
      if (existe.length) {
        let update = `update conditions set qtymax=${req.body.qteMax} where m_product_id=${m_product_id}`;
        tabConditions.update(update, (rep) => {});
      } else {
        let name = await getNameProduct(m_product_id);
        let requette = `SELECT * FROM xx_quota WHERE createdby=? AND quantity=0 AND m_product_id=${m_product_id}`;
        let data = {
          m_product_id: m_product_id,
          name: name[0].NAME,
          requette: requette,
          message: "Vous avez déjà réservé ce produit",
          compteur: 1,
          isactive: "Y",
          qtyMax: req.body.qteMax,
        };
        tabConditions.insert(data, (rep) => {});
      }
        let updateIsCondition= `update XX_Quota set IsCondition = 'Y' where m_product_id=${m_product_id}`;
        Articles.update(updateIsCondition,(rep) => {
          res.status(200).send({rep});
        });
    }
  },
  getLastMonth: (req, res) => {
    try {
      let sql = `select RotationProductLastMonth(${req.body.m_product_id}) LASTMONTH from dual`;
      tabXx_quota.selectAll(sql, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getLastWeek: (req, res) => {
    try {
      let sql = `select RotationProductLastWeek(${req.body.m_product_id}) LASTWEEK from dual`;
      tabXx_quota.selectAll(sql, (reponse) => {
        res.status(200).send(reponse);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
};

function getMproductId(xx_quota_id) {
  return new Promise((resolve, reject) => {
    let sql = ` select distinct m_product_id from xx_quota where xx_quota_id=${xx_quota_id} `;
    tabXx_quota.selectAll(sql, (reponse) => {
      resolve(reponse[0].M_PRODUCT_ID);
    });
  });
}
function getNameProduct(m_product_id) {
  return new Promise((resolve, reject) => {
    let sql = ` select name from m_product where m_product_id=${m_product_id} `;
    Articles.select(sql, (rep) => {
      resolve(rep);
    });
  });
}
function existeCondition11(m_product_id) {
  return new Promise((resolve, reject) => {
    let json = {
      select: "*",
      where: ` where m_product_id= ${m_product_id} `,
    };
    tabConditions.select(json, (rep) => {
      resolve(rep);
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
function date1() {
  var now = new Date();
  var dd = now.getDate();
  var yy = now.getFullYear();
  var mm = now.getMonth() + 1;
  return dd + "/" + mm + "/" + yy;
}
function heure() {
  var today = new Date();
  var hh = today.getHours();
  var mm = today.getMinutes();
  return hh + ":" + mm;
}
