const tabXx_quota = require("../../models/tabXx_quota");
const tabXx_quotaRef = require("../../models/tabXx_quotaRef");
const tabUsers = require("../../models/tabUsers");
const tabAd_User = require("../../models/ad_user");
const tabXx_quota1 = require("../../models/tabXx_quota1");
const tabM_product = require("../../models/tabM_product");
const tabConditions = require("../../models/tabConditions");
const XxQuotaRepository = require("../../repositories/XxQuotaRepository");

module.exports = {
  getProduit: async (req, res) => {
    var order = JSON.parse(req.body.order);
    try {
      const jsonDC = {
        id_dc: req.body.id_dc,
        ad_org_id: 0,
        ad_org_idOper: req.body.ad_org_id,
        id_svc: req.body.id_svc,
        order
      };
      const listProducts = await listeProduitQuota(jsonDC);
      const listConditions = await tabConditions.selectAllConditions();
      return res.status(200).send({listProducts, listConditions});
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  addProductXxQuota: async function (req, res) {
    try {
      const {
        c_bpartner_id,
        m_product_id,
        qts,
        valueReference,
        ad_user_id,
        id_dc,
        id_svc
      } = req.body;
  
      // Verify is bloked
      const isBlocked = await getIsBlokedOper(ad_user_id, 'N');
      if (isBlocked) return res.status(200).send({result: `La réservation des produits quota a été bloquée`});

      // Verify if the reference is not confirmed
      const isReferenceConfirmed = await runReferenceIsConfirme(valueReference);
      if (isReferenceConfirmed) {
        return res.status(200).send({result: 'La commande a été confirmée par le superviseur'});
      }
  
      // Verify if the product exists in the reference
      const existProductInReference = await XxQuotaRepository.GetExistProductInReferenceAsync(valueReference, m_product_id);
      if (existProductInReference > 0) {
        return res.status(200).send({result: 'Le produit existe déjà dans la référence'});
      }
  
      // Get id_dc for discount quantity
      const ifPartaged = await runIfPartager(m_product_id, id_dc);
      const final_id_dc = ifPartaged > 1 ? parseInt(id_svc) : parseInt(id_dc);
  
      const color = await runColor(m_product_id);
  
      // Conditions test
      const condition = await tabConditions.selectIfProductExist(m_product_id);
      const isCondition = await testConditionWithQuantity(condition, qts);
      if (!isCondition) {
        return res.status(200).send({result: `La condition n'est pas respectée: quantité (Qte Max:${condition[0].qtymax}) ou nombre de réservations erroné.`});
      }
  
      // Manage Quantity XxQuota
      const qtyAllocated = parseInt(qts) * (-1);
      const resultOfManageQuantity = await XxQuotaRepository.ManageQuantiyXxQuotaAsync(qtyAllocated, final_id_dc, m_product_id);
      
      if (resultOfManageQuantity != 1) return res.status(200).send({ result: 'Quantité inexistante' });
  
      const organizationId = await getOrganizationId(valueReference);
      const jsonInsert = {
        ad_org_id: organizationId[0].ad_org_id,
        created: new Date(),
        createdby: parseInt(ad_user_id),
        m_product_id: parseInt(m_product_id),
        ad_user_id: parseInt(ad_user_id),
        qtyallocated: parseInt(qts),
        reference: valueReference,
        c_bpartner_id: parseInt(c_bpartner_id),
        color: color.length > 0 ? color[0].COLOR : null,
        isCondition: condition.length > 0 ? 'Y' : 'N',
      };

      // Insert the new quota line
      const insertResult = await XxQuotaRepository.InsertXxQuotaAsync(jsonInsert);
      insertRowMysql(jsonInsert, []);
      if (insertResult == 1) {
        return res.status(200).send({ IXxquota: [], status: "Y" });
      } else {
        await XxQuotaRepository.ManageQuantiyXxQuotaAsync(qtyAllocated * -1, final_id_dc, m_product_id);
        return res.status(500).send({ result: 'Failed to insert quota line' });
      }
    } catch (error) {
      res.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
  
    async function testConditionWithQuantity(lineCondition, qtyAllocated) {
      if (lineCondition.length === 0) return true;
  
      const existReservation = await XxQuotaRepository.ReservationCounterAsync(req.body.ad_user_id, req.body.m_product_id);
      return (lineCondition[0].compteur > existReservation.length && lineCondition[0].qtymax >= qtyAllocated);
    }
  },
  quotaDemander: (req, res) => {
    let json = {
      indice: 122,
      reference: req.body.reference,
      ad_org_id: req.body.ad_org_id,
    };
    listeQuotaDemander(json, (reponse) => {
      res.send(reponse);
    });
  },
  deleteLineXxQuotaByOper: async(req, res) => {
    const {
      id_dc,
      id_svc,
      m_product_id,
      reference,
      } = req.body;
    if (m_product_id == '' || id_dc == '' || id_svc == ''  || reference == '') {
      return res.status(200).send('Veuillez renseigner tous les champs.');
    }
    console.log(m_product_id, id_dc, id_svc, reference);
    const ifPartage = await runIfPartager(m_product_id, id_dc);
    const final_id_dc = ifPartage > 1 ? id_svc : id_dc;

    // get Quantity for delete
    const qtySupp = await getQuatiteSupprimer(reference, m_product_id);

    // get condition for deleting
    const conditionSupp = await getConditionSupprimer(reference);
    const condition = await tabConditions.selectIfProductExist(m_product_id);

    if (conditionSupp[0].traiter == "N" && conditionSupp[0].confirme == "N" && condition.length == 0) {
      const deleted = await XxQuotaRepository.DeleteProductAsync(reference, m_product_id);
      if (deleted > 0) {
        await XxQuotaRepository.ManageQuantiyXxQuotaAsync(qtySupp * -1, final_id_dc, m_product_id);
        await tabXx_quota1.deleteLineXxQuotaByReferenceAndProduct(m_product_id, reference);
        res.status(200).send("ok");
      }
    } else {
      if(conditionSupp[0].confirme == "Y") return res.status(200).send("La commande a été confirmée par le superviseur");
      return res.status(200).send("Produit conditionnel, suppression impossible. Contactez le superviseur.");
    }

  },
  modifyProductQuotaBySV: async (req, res) => {
    const {
      qtyOrdered,
      xx_quota_id,
      id_dc,
      m_product_id,
      qtyDC,
      id_user
    } = req.body;
    
    // Get id_dc for discount quantity
    const ifPartage = await runIfPartager(m_product_id, id_dc);
    const final_id_dc =  ifPartage > 1 ? id_user : id_dc

    // Manage Quantity XxQuota
    const discountQty = parseInt(qtyDC) * -1;
    const resultOfManageQuantity = await XxQuotaRepository.ManageQuantiyXxQuotaAsync(discountQty, parseInt(final_id_dc), parseInt(m_product_id));

    if(resultOfManageQuantity == 1) {
      await XxQuotaRepository.ModifyProductQuotaBySVAsync(qtyOrdered, id_user, xx_quota_id);
      const sql = `update xx_quota set quantity=${qtyOrdered},updatedby=${final_id_dc} where xx_quota_id=${xx_quota_id}`;
      await tabXx_quota1.update(sql);
      res.status(200).send("ok");
    } else {
      res.status(200).send("Quantité indisponible");
    }
  },

  bloqueClientDc: async (req, res) => {
    const json = { id_dc: req.body.id_dc, bloque: req.body.bloque };
    const response = await tabUsers.updateBloqueOper(json);

    if(response > 0) {
      return res.status(200).send(req.body.bloque);
    }
    res.status(300).send('Erreur lors du blocage ou du déblocage des opérateurs')
  },

  updateQtyAdmineBase: (req, res) => {
    let json = { indice: req.body.indiceDc };
    tabAd_User.findByName(json, (id) => {
      let xx_quota_id = req.body.xx_quota_id;
      let json8 = { indice: 8, xx_quota_id: xx_quota_id };
      tabXx_quota.select(json8, (reponse) => {
        let qts = -1 * req.body.qtyOrdered;
        let json22 = { qts: qts, id_dc: id[0][5], m_product_id: reponse[0][3] };
        tabXx_quota.updateAndInsert(json22, (reponse) => {});
      });
    });
  },

  listSvc: (req, res) => {
    runListSvc();
    async function runListSvc() {
      let svc = await runSvc();
      let arraySvc = await runNameSvc(svc);
      res.send(arraySvc);
    }
    function runNameSvc(svc) {
      return new Promise((resolve, reject) => {
        let sql = `SELECT name,ad_user_id,ad_org_id from AD_User where AD_User_ID in (${svc})`;
        tabAd_User.select(sql, (repo) => {
          resolve(repo);
        });
      });
    }
    function runSvc() {
      return new Promise((resolve, reject) => {
        let sql = `SELECT DISTINCT id_svc FROM users WHERE id_svc!=0`;
        let array = "";
        tabUsers.select(sql, (rep) => {
          for (const svc of rep) {
            array = array + "," + svc.id_svc;
          }
          array = array.slice(1);
          resolve(array);
        });
      });
    }
  },
};
async function listeProduitQuota(jsonDC) {
  return new Promise((resolve, reject) => {
    let order = 'q.percentage desc';
    switch (jsonDC.order.orderBy) {
      case 'NAME' : order = `pr.name ${jsonDC.order.order}`;
      break;
      case 'QTYORDERED' : order = `q.qtyordered ${jsonDC.order.order}`;
      break;
      default: order = 'q.percentage desc';
    }
    let sql = `SELECT q.m_product_id,pr.name,q.qtyordered,q.color, q.percentage from xx_quota q 
    inner join m_product pr 
    on q.m_product_id=pr.m_product_id 
    inner join AD_User adu on adu.AD_User_ID=q.createdby   
    where (q.createdby=${jsonDC.id_dc} and q.ad_org_id=${jsonDC.ad_org_id} and qtyordered>0)
    OR (q.createdby =${jsonDC.id_svc} and qtyordered>0) order by ${order}`;
      tabXx_quota.findProduitDC(sql, (result) => {
        resolve(result);
      })
  })

}
function updateQtsDc(ei, eu) {
  return new Promise((resolve, reject) => {
    tabXx_quota.updateAndInsert(eu, (isAffected) => {
      if (isAffected == 1) {
        insertRow(ei, async (reponse) => {
           insertRowMysql(ei, reponse); //pour insertion dans mysql
          let json2 = { IXxquota: reponse, status: "Y" };
          resolve(json2);
        });
      } else {
        let message = "Quantité Inexistante";
        resolve(message);
      }
    });
  });
}
function insertRowMysql(ei, reponse) {
  runInsertRowMysql();
  async function runInsertRowMysql() {
    let name = await getName(ei.m_product_id);
    let xx_quota_id = await getXxQuotaId(ei.reference, ei.m_product_id)
    let insert = await insertMysql(name[0][0], xx_quota_id[0].XX_QUOTA_ID);
  }

  function getXxQuotaId(reference, m_product_id) {
    return new Promise(async (resolve, reject) => {
      let sql = `select xx_quota_id from xx_quota where reference = ${reference} and m_product_id=${m_product_id}`;
      var result = await tabXx_quota.selectFeature(sql);
      resolve(result)
    })
  }
  function getName(m_product_id) {
    return new Promise((resolve, reject) => {
      let json = {
        select: ` name `,
        where: ` where m_product_id=${m_product_id}`,
      };
      tabM_product.select(json, (reponse) => {
        resolve(reponse);
      });
    });
  }
  function insertMysql(name, xx_quota_id) {
    return new Promise((resolve, reject) => {
      delete ei.created;
      ei.created = dateOracle();
      ei.updated = dateOracle();
      ei.xx_quota_id = xx_quota_id;
      ei.c_bpartner_id = ei.c_bpartner_id;
      ei.name = name;
      tabXx_quota1.insert(ei, (repp) => {});
    });
  }
}
async function insertRow(e, cb) {
  let organizationId = await getOrganizationId(e.reference);
  let jsonInsert = {
    ad_org_id: organizationId[0].ad_org_id,
    created: e.created,
    createdby: e.createdby,
    m_product_id: e.m_product_id,
    ad_user_id: e.ad_user_id,
    qtyallocated: e.qtyallocated,
    reference: e.reference,
    c_bpartner_id: e.c_bpartner_id,
    color: e.color,
    isCondition: e.isCondition
  };
  tabXx_quota.insert(jsonInsert, (inserted) => {
    if (inserted == 1) {
      let json1 = {
        indice: 122,
        reference: e.reference,
      };
      listeQuotaDemanderOper(json1, (reponse) => {
        cb(reponse);
      });
    } else {
      let messageeErr = "Failed insertion";
      cb(messageeErr);
    }
  });
}
async function getOrganizationId(reference) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT DISTINCT ad_org_id FROM xx_quotaref WHERE reference = ${reference}`;
    var result = tabXx_quotaRef.selectPromise(sql);
    resolve(result);
  });
}

function runOrderIsConfirme(reference, ad_org_id) {
  return new Promise((resolve, reject) => {
    let sql = `select * from xx_quotaref where reference='${reference}'`;
    tabXx_quotaRef.featuresSelect(sql, (rep) => {
      resolve(rep);
    });
  });
}
function runReferenceIsConfirme(reference) {
  return new Promise((resolve, reject) => {
    let sql = `select * from xx_quotaref where reference='${reference}' and confirme='Y'`;
    tabXx_quotaRef.featuresSelect(sql, (rep) => {
      if(rep.length == 0 ) resolve(false)
        resolve(true);
    });
  });
}
function getIsBlokedOper(ad_user_id, bloque){
  return new Promise(async (resolve, reject) => {
    let bloqueData = {
      ad_user_id,
      bloque
    };
    var result = await tabUsers.selectIsBlocked(bloqueData);
    if(result.length > 0)
      resolve(false)
    resolve(true); 
  });
}
function listeQuotaDemander(jsonReference, cb) {
  //indice 12
  tabXx_quota.select(jsonReference, (listReference) => {
    cb(listReference);
  });
}
// operateur list quota 
async function listeQuotaDemanderOper(jsonReference, cb) {
  //indice 122
  let sql = `SELECT q.m_product_id,pr.name,q.qtyallocated,q.quantity,q.xx_quota_id,q.c_bpartner_id,q.qtyordered,q.color
        from xx_quota q 
        inner join m_product pr on q.m_product_id=pr.m_product_id 
        inner join AD_User adu on adu.AD_User_ID=q.createdby 
        where q.reference=${jsonReference.reference} order by q.xx_quota_id desc`;
  let result = await tabXx_quota.selectFeature(sql);
  cb(result);
}
function runIfPartager(m_product_id, id_dc) {
  return new Promise((resolve, reject) => {
    let sql = ` select * from xx_quota where m_product_id=${m_product_id} and ad_org_id=0`;
    tabXx_quota.selectAll(sql, (reponse) => {
      resolve(reponse.length);
    });
  });
}

function getQuatiteSupprimer(reference, m_product_id) {
  return new Promise((resolve, reject) => {
    let sql = `select * from xx_quota where reference=${reference} and m_product_id=${m_product_id}` ;
    
    tabXx_quota.selectSql(sql, (reponse) => {
      if (reponse && reponse.length) {
        const { QUANTITY, QTYALLOCATED } = reponse[0];
        const quantityToSubtract = QUANTITY > 0 ? QUANTITY : QTYALLOCATED;
        resolve(quantityToSubtract * -1);
      } else {
        reject(new Error("No records found"));
      }
    });
  });
}

function getConditionSupprimer(reference) {
  return new Promise((resolve, reject) => {
    let json = {
      select: ` min(traiter) as traiter,min(confirme) as confirme `,
      where: `where reference='${reference}'`,
    };
    tabXx_quotaRef.selectOne(json, (reponse) => {
      resolve(reponse);
    });
  });
}

function runColor(m_product_id) {
  return new Promise((resolve, reject) => {
    let sql = `select color from xx_quota where m_product_id=${m_product_id} and color is not null and rownum <= 1`;
    tabXx_quota.selectAll(sql, (reponse) => {
      resolve(reponse);
    });
  });
}

//dd+'/'+mm+'/'+yy;
function date() {
  var today = new Date();
  var dd = today.getDate();
  var yy = today.getFullYear();
  var mm = today.getMonth() + 1;
  return dd + "/" + mm + "/" + yy;
}
//yy+'/'+mm+'/'+dd;
function dateOracle() {
  var today = new Date();
  var dd = today.getDate();
  var yy = today.getFullYear();
  var mm = today.getMonth() + 1;
  return yy + "/" + mm + "/" + dd;
}
