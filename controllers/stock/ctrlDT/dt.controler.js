const tabAd_User = require("../../../models/ad_user");
const tabXx_quota = require("../../../models/tabXx_quota");
const tabPreparation = require("../../../models/transfer/tabPreparation");
const tabTransfer = require("../../../models/transfer/tabTransfer");
const TabInventaireMysql = require("../../../models/transfer/inventaire/tabInventaireMysql");
const excel = require("exceljs");

module.exports = {
  getParametreDt: async (req, res) => {
    let params = await getParams(req.body.dateD);
    await updateQtyMinusOne("UPDATE M_InOutLine SET QtyMovemented=null WHERE QtyMovemented = -1");
    await updateQtyMinusOne("UPDATE M_InOutLine SET QtyMovementedctrl=null WHERE QtyMovementedctrl = -1");
    res.status(200).send(params);
    function updateQtyMinusOne(sql) {
      return new Promise((resolve, reject) => {
        tabPreparation.featureUpdate(sql, (reponse) => {
          resolve(reponse);
        });
      });
    }
  },
  getListCorrectionToDt: async (req, res) => {
    try {
      const result = await getDataRectif(req.body);
      const response = await getFilterProducts(result);
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  getStatPreparation: async (req, res) => {
    if (!req.query.date || !req.query.groupId || !req.query.isQr) {
      return res.status(400).send("Missing required parameters");
    }
    const result = await getDataRectif(req.query);
    const response = await getFilterStatProducts(result);
    await constExcel(res, response);
  },
  getStatPreparationDetail: async (req, res) => {
    const { startDate, endDate, type } = req.query;

    if (!startDate || !endDate || !type) {
      return res.status(400).send("Missing required parameters");
    }
    const programme = await tabPreparation.FindProgrammeJourRepository(startDate, endDate);
    if (!programme || programme.length === 0) {
      return res.status(404).send("No programme found for the given date");
    }

    const XX_ProgrammeJour_IDs = programme.map((p) => p.XX_PROGRAMMEJOUR_ID).join(",");

    const result =
      req.query.type === "p"
        ? await tabPreparation.FindStatRectifPreparateurRepository(XX_ProgrammeJour_IDs)
        : await tabPreparation.FindStatRectifControleurRepository(XX_ProgrammeJour_IDs);
    await constExcelDetail(res, req.query.type, result);
  },
  getAdUserName: (req, res) => {
    try {
      let sql = `select name from ad_user where ad_user_id=${req.body.id}`;
      tabAd_User.select(sql, (Result) => {
        res.send(Result);
      });
    } catch (error) {
      res.send(error);
    }
  },
  getClientOrder: (req, res) => {
    try {
      let sql = `select q.xx_quota_id,p.name,bp.name as client,q.qtyallocated,q.quantity,q.reference from xx_quota q
      inner join m_product p on p.m_product_id=q.m_product_id
      inner join c_bpartner bp on bp.c_bpartner_id=q.c_bpartner_id  
      where q.m_product_id in (select m_product_id from m_product where ISNEEDORDER='Y')`;
      tabXx_quota.selectAll(sql, (reponse) => {
        res.send(reponse);
      });
    } catch (error) {
      res.send(error);
    }
  },
  updateQuantityOrder: (req, res) => {
    try {
      let sql = `update xx_quota set quantity=qtyallocated,updatedby=${req.body.ad_user_id} where xx_quota_id=${req.body.xx_quota_id}`;
      tabXx_quota.featureUpdate(sql, (reponse) => {
        res.status(200).send([reponse]);
      });
    } catch (error) {
      res.send(error);
    }
  },
  selectProductOrder: (req, res) => {
    let sql = `select * from xx_quota q
    inner join m_product p on p.m_product_id=q.m_product_id
    where q.xx_quota_id=${req.body.xx_quota_id}`;
    tabXx_quota.selectAll(sql, (reponse) => {
      res.send(reponse);
    });
  },
  modifyQuantity: (req, res) => {
    let sql = `update xx_quota set quantity=${parseInt(req.body.quantity)} 
    where xx_quota_id=${req.body.xx_quota_id}`;

    tabXx_quota.featureUpdate(sql, (reponse) => {
      res.send([reponse]);
    });
  },
  getListInventaireByDate: async (req, res) => {
    let sql = `SELECT i.*, DATE_FORMAT(createdAt, '%m-%d-%Y') AS dateCreated FROM inventaire i 
    WHERE createdAt = '${req.body.date}' ORDER BY i.name ASC`;
    var result = await TabInventaireMysql.select(sql);
    res.status(200).send(result);
  },
};

async function getDataRectif(body) {
  const params = await getParams(body.date);
  const salesRegionGroupIds = params.map((subArray) => subArray[0].toString()).join(", ");
  const json = {
    date: convertDigitIn(body.date),
    groupId: salesRegionGroupIds,
    xxPreparateurTrId: "1041755",
    isQr: body.isQr === "true" ? "Y" : "N",
    empl: "null",
    userSelected: "1047552",
    ad_role_id: "1003471",
  };
  const result = body.isQr === "Y" ? await tabTransfer.selectProductToDtQRY(json) : await tabTransfer.selectProductToDtQRN(json);
  return result;
}

async function constExcel(res, data) {
  return new Promise((resolve, reject) => {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Customers");

    let sheetDC = [
      { header: "Utilisateurs", key: "agent", width: 50 },
      { header: "Nombre de produits", key: "productCount", width: 50 },
      { header: "Total Quantités", key: "totalQuantity", width: 50 },
    ];

    worksheet.columns = sheetDC;

    // Add Array Rows
    worksheet.addRows(data);

    // Apply borders to all used cells (including header row)
    worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
      row.eachCell({ includeEmpty: false }, function (cell, colNumber) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=" + `statePreparateur_${datea()}.xlsx`);

    return workbook.xlsx
      .write(res)
      .then(function () {
        res.status(200).end();
        resolve();
      })
      .catch(reject);
  });
}

async function constExcelDetail(res, type, data) {
  return new Promise((resolve, reject) => {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Customers");

    const sheetP = [
      { header: "Préparateurs", key: "NAME", width: 50 },
      { header: "Nombre de produits", key: "M_PRODUCT_ID", width: 50 },
      { header: "Total Quantités", key: "DIFFQTY", width: 50 },
    ];

    const sheetC = [
      { header: "Contrôleurs", key: "NAME", width: 50 },
      { header: "Nombre de produits", key: "M_PRODUCT_ID", width: 50 },
      { header: "Total Quantités", key: "DIFFQTY", width: 50 },
    ];

    worksheet.columns = type == "p" ? sheetP : sheetC;

    // Add Array Rows
    worksheet.addRows(data);

    // Apply borders to all used cells (including header row)
    worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
      row.eachCell({ includeEmpty: false }, function (cell, colNumber) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=" + `statePreparateur_${datea()}.xlsx`);

    return workbook.xlsx
      .write(res)
      .then(function () {
        res.status(200).end();
        resolve();
      })
      .catch(reject);
  });
}

function getNetDay(params) {
  return params === 0 ? 7 : params;
}

function datea() {
  var today = new Date();
  var dd = today.getDate();
  var yy = today.getFullYear();
  var mm = today.getMonth() + 1;
  return dd + "/" + mm + "/" + yy;
}

function convertDigitIn(str) {
  return str.split("-").reverse().join("-");
}

async function getFilterProducts(list) {
  const filter = list.filter((r) => r.QTYMOVEMENTED != null || r.QTYMOVEMENTEDCTRL != null);
  const filter1 = list.filter((r) => r.QTYMOVEMENTED == null && r.QTYMOVEMENTEDCTRL == null && r.MOVEMENTQTY != r.ORIGQTYENTERED);
  return await filter.concat(filter1);
}

async function getFilterStatProducts(list) {
  const filter = list.filter((r) => r.QTYMOVEMENTED != null);
  const groupBy = await groupByAgent(filter);
  return groupBy;
}

async function groupByAgent(data) {
  return Object.values(
    data.reduce((acc, { PREPARATEUR, M_PRODUCT_ID, ORIGQTYENTERED, QTYMOVEMENTED }) => {
      if (!acc[PREPARATEUR]) {
        acc[PREPARATEUR] = {
          agent: PREPARATEUR,
          totalQuantity: 0,
          products: new Set(),
        };
      }
      acc[PREPARATEUR].totalQuantity += ORIGQTYENTERED - QTYMOVEMENTED;
      acc[PREPARATEUR].products.add(M_PRODUCT_ID);
      return acc;
    }, {})
  ).map(({ agent, totalQuantity, products }) => ({
    agent,
    productCount: products.size,
    totalQuantity,
  }));
}

async function getParams(dateD) {
  return new Promise((resolve, reject) => {
    var mydate = new Date(dateD);
    let json = { netday: getNetDay(mydate.getDay()) };
    tabPreparation.selectParametre(json, (reponse) => {
      resolve(reponse);
    });
  });
}
