const tabCorder = require("../../models/tabCorder");
const tabXx_quotaRef = require("../../models/tabXx_quotaRef");
const tabXx_quota = require("../../models/tabXx_quota");
const tabUsers = require("../../models/tabUsers");
const tabAd_User = require("../../models/ad_user");
const tabWanaAnalyseStockAtt = require("../../models/wana_analyse_stock_att");
const tabNclient = require("../../models/tabNclients");
const tabM_product = require("../../models/tabM_product");
const XxQuotaRepository = require("../../repositories/XxQuotaRepository");

module.exports = {
  updateCommande: (req, res) => {
    let json = {
      indice: 10,
      reference: req.body.reference,
      traiter: "Y",
      confirme: "N",
    };
    let json1 = { indice: 2, reference: req.body.reference, traiter: "N" };
    let json2 = { indice: 17, reference: req.body.reference, modifierDC: "Y" };
    tabXx_quotaRef.update(json, (reponse) => {
      tabXx_quotaRef.update(json1, (reponse11) => {
        tabXx_quotaRef.update(json2, (reponse22) => {
          if (reponse > 0) {
            res.send("Y");
          } else {
            res.send("N");
          }
        });
      });
    });
  },
  commandeReserve: (req, res) => {
    let json = {
      indice: 12,
      reference: req.body.reference,
      ad_org_id: req.body.ad_org_id,
    };
    tabXx_quota.select(json, (rep) => {
      let jsonBcc = {
        indice: 2,
        reference: req.body.reference,
        ad_org_id: req.body.ad_org_id,
        dateCreation: date(),
      };
      tabXx_quotaRef.select(jsonBcc, (liste) => {
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
        tabCorder.mntBcc(idBccListe, (reponse) => {
          let jsonRepp = { liste: rep, mnt: reponse };
          res.send(jsonRepp);
        });
      });
    });
  },
  qtsReserver: (req, res) => {
    runQtyReserve();
    async function runQtyReserve() {
      let listIndice = await getlistIndice();
      let productQtyReserve = await getProductQtyReserve();
      let listFinal = productQtyReserve.filter((m) => {
        if (_isContains(listIndice, m.AD_USER_ID)) {
          return m;
        }
      });
      res.status(200).send(listFinal);
    }
    function getlistIndice() {
      return new Promise((resolve, reject) => {
        let sql = `SELECT indice, ad_user_id FROM users WHERE id_svc=${req.body.id_dc} AND ad_user_id IS NOT NULL`;
        tabUsers.select(sql, (result) => {
          resolve(result);
        });
      });
    }
    function getProductQtyReserve() {
      return new Promise((resolve, reject) => {
        let sql = `select q.reference,adu.name as indice,adu.ad_user_id,p.name as product,bp.name as client,q.qtyallocated,q.xx_quota_id 
               from xx_quota q 
               inner join m_product p 
               on q.m_product_id=p.m_product_id 
               inner join ad_user adu 
               on q.createdby =adu.ad_user_id 
               inner join c_bpartner bp 
               on q.c_bpartner_id=bp.c_bpartner_id 
               where q.createdby<>${req.body.id_dc} 
               and q.reference<> ' ' 
               and q.quantity=0
               and q.updatedby = 0 order by p.name`;
        tabXx_quota.selectAll(sql, (reponse) => {
          resolve(reponse);
        });
      });
    }
  },
  xx_arrivage: (req, res) => {
    let likes = req.body.like;
    likes = likes.toUpperCase();
    let sql = `SELECT q.xx_quota_id,mp.name,q.quantity,q.QTYENTERED,q.QTYORDERED,q.DESCRIPTION,sc.RATING,
      q.M_PRODUCT_ID FROM xx_quota q
      INNER JOIN m_product mp on q.M_PRODUCT_ID=mp.M_PRODUCT_ID
      INNER JOIN XX_SalesContext sc on sc.XX_SalesContext_ID=mp.XX_SalesContext_ID
      WHERE q.ad_org_id=${req.body.ad_org_id} and mp.name LIKE '${likes}' ||'%%'
      ORDER BY q.quantity desc  `;
    tabXx_quota.selectAll(sql, (reponse) => {
      res.send(reponse);
    });
  },
  updateQtyBase: (req, res) => {
    let json = {
      indice: 8,
      xx_quota_id: req.body.xx_quota_id,
      qtyordered: req.body.qtyOrdered,
    };
    tabXx_quota.updateArrivage(json, (reponse) => {
      res.send().status(200);
    });
  },
  bloqueOper: (req, res) => {
    let json = { indice: 8, id_dc: req.body.id_dc, bloque: "Y" };
    tabUsers.findByOne(json, (reponse) => {
      if (reponse.length > 0) {
        res.send("Y");
      } else if (reponse.length == 0) {
        res.send("N");
      }
    });
  },
  deleteReservationLine: async (req, res) => {
    const {
      xx_quota_id,
      id_dc,
    } = req.body;

    // get line xx_quota
    let lineXxQuota = await XxQuotaRepository.GetListProductById(xx_quota_id);
    
    // test product if partage
    let ifPartage = await runIfPartager(lineXxQuota.M_PRODUCT_ID);
    let final_id_dc = ifPartage > 1 ? id_dc : 1032294;

    // if reference confirmer ou traiter
    let sql = `select * from xx_quotaref where reference=${lineXxQuota.REFERENCE}`;
    let lineReference = await tabXx_quotaRef.selectPromise(sql);

    if (lineReference[0].traiter == "N" && lineReference[0].confirme == "N") {
      let quantity = lineXxQuota.QUANTITY == 0 ? lineXxQuota.QTYALLOCATED : lineXxQuota.QUANTITY;

      let manageQuantityQuota = await XxQuotaRepository.ManageQuantiyXxQuotaAsync(
        parseInt(quantity),
        parseInt(final_id_dc),
        parseInt(lineXxQuota.M_PRODUCT_ID)
      );
      if(manageQuantityQuota == 1) {
        await XxQuotaRepository.DeleteProductAsync(lineXxQuota.REFERENCE, lineXxQuota.M_PRODUCT_ID);
        return res.status(200).send('ok');
      }
      return res.status(200).send(`La suppression du produit ${lineXxQuota.NAME} a échoué`);
    }
    return res.status(200).send(`La référence est traitée ou confirmée.`);
  },
  annulerLignereserver: (req, res) => {
    runAnnulerLignereserver();
    async function runAnnulerLignereserver() {
      let reponse = await selectXxQuota();
      let isPartage = await runIfPartager(reponse[0][3]);
      let ref = await selectRef11(reponse, isPartage);
      res.send(ref);
    }
    function selectXxQuota() {
      return new Promise((resolve, recject) => {
        let json = { indice: 8, xx_quota_id: req.body.xx_quota_id };
        tabXx_quota.select(json, (reponse) => {
          resolve(reponse);
        });
      });
    }
    function selectRef11(reponse, isPartage) {
      let id_dc11 = undefined;
      if (isPartage == 1) {
        id_dc11 = 1032294;
      } else {
        id_dc11 = req.body.id_dc;
      }
      return new Promise((resolve, recject) => {
        let jsonRef = {
          indice: 2,
          reference: reponse[0][6],
          ad_org_id: req.body.ad_org_id,
          dateCreation: date(),
        };
        tabXx_quotaRef.select(jsonRef, (repp) => {
          if (repp.length) {
            if (repp[0].traiter == "N" && repp[0].confirme == "N") {
              let jsonDC = {
                qts: -1 * reponse[0][2],
                m_product_id: reponse[0][3],
                id_dc: id_dc11,
                ad_org_id: 0,
              };
              tabXx_quota.updateAndInsert(jsonDC, (repo) => {
                if (repo == 1) {
                  let jsonDel = { indice: 8, xx_quota_id: reponse[0][0] };
                  tabXx_quota.delete(jsonDel, (repDel) => {
                    if (repDel == 1) {
                      resolve("ok");
                    }
                  });
                }
              });
            } else {
              resolve("no");
            }
          }
        });
      });
    }
  },
  statusCommande: (req, res) => {
    let json = { indice: 22, status: "Y", reference: req.body.reference };
    tabXx_quotaRef.update(json, (reponse) => {
      res.send("ok");
    });
  },
  getListeDC: (req, res) => {
    let json = { indice: 0, role: 1, id_dc: 0, ad_org_id: 0 };
    tabUsers.findByOne(json, (listDc) => {
      res.send(listDc);
    });
  },
  xx_arrivageAdmin: (req, res) => {
    let json = { indice: req.body.indice_dc };
    tabAd_User.findByName(json, (id) => {
      let json1 = { indice: 11122, id_dc: id[0][5], ad_org_id: id[0][0] };
      tabXx_quota.select(json1, (repo) => {
        res.send(repo);
      });
    });
  },

  listeNvClientSV: (req, res) => {
    let json = {
      indice: 4,
      clause: `(valide=${"'N'"} OR valide=${"'S'"}) AND ad_org=${
        req.body.ad_org_id
      }`,
    };
    tabNclient.select(json, (reponse) => {
      res.send(reponse);
    });
  },
  selectClientNV: (req, res) => {
    let json = { indice: 4, clause: `idClient=${req.body.idClient}` };
    tabNclient.select(json, (reponse) => {
      res.send(reponse);
    });
  },
  validerClient: (req, res) => {
    let json = {
      indice: 2,
      svc: req.body.indiceOper,
      valide: "S",
      dateSVC: sysDate(),
      idClient: req.body.idClient,
    };
    tabNclient.update(json);
    res.send("ok");
  },
  getProductColor: (req, res) => {
    let sql = `select distinct(p.m_product_id), q.xx_quota_id,p.name,q.color,q.qtyallocated,q.qtyordered from xx_quota q
    inner join m_product p on p.m_product_id=q.m_product_id
    where q.qtyordered >0 OR q.quantity>0 and q.createdby=1032294`;
    tabM_product.selectFeatures(sql, (result) => {
      res.send(result);
    });
  },
  validerColor: (req, res) => {
    let sql = `UPDATE XX_QUOTA SET color='${req.body.color}' WHERE M_PRODUCT_ID=${req.body.M_PRODUCT_ID}`;
    tabM_product.update(sql, (result) => {
      res.send({ result });
    });
  },
  getColor: (req, res) => {
    let sql = `select m_product_id, color from xx_quota where color is not null`;
    tabXx_quota.selectAllTable(sql, (result) => {
      res.send(result);
    });
  },
  couleurCommande: (req, res) => {
    runCouleurCommande();
    async function runCouleurCommande() {
      let references = await runReferences(req.body.reference);
      if (references.length) {
        for (var i = 0; i < references.length; i++) {
          let sql = `UPDATE xx_quota SET COLOR = (select color from xx_quota where m_product_id=${references[i].M_PRODUCT_ID} and color is not null and rownum <= 1)  WHERE m_product_id=${references[i].M_PRODUCT_ID}`;
          tabXx_quota.updateAll(sql, (reponse) => {});
        }
      }
    }
    function runReferences(reference) {
      return new Promise((resolve, reject) => {
        let sql = `select xx_quota_id,color,m_product_id from xx_quota where reference='${reference}' and color is null`;
        tabXx_quota.selectAll(sql, (reponse) => {
          resolve(reponse);
        });
      });
    }
  },
  couleurCommandeConfirmer: (req, res) => {
    let json = `select color,
        SUM(CASE 
            WHEN updatedby = 0 THEN qtyallocated
            ELSE quantity
        END) AS quantity
    from xx_quota 
    where reference = '${req.body.reference}'	 
    GROUP BY color ORDER BY color`;
    tabXx_quota.selectAll(json, (reponse) => {
      res.send(reponse);
    });
  },
};

function runIfPartager(m_product_id) {
  return new Promise((resolve, reject) => {
    let sql = ` select * from xx_quota where m_product_id=${m_product_id} and ad_org_id=0`;
    tabXx_quota.selectAll(sql, (reponse) => {
      resolve(reponse.length);
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

function sysDate() {
  var now = new Date();
  return now;
}
function _isContains(json, value) {
  let contains = false;
  Object.keys(json).some((key) => {
    contains =
      typeof json[key] === "object"
        ? _isContains(json[key], value)
        : json[key] === value;
    return contains;
  });
  return contains;
}
