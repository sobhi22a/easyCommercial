const TabInventaire = require("../../../models/transfer/inventaire/tabInventaire");
const TabInventaireMysql = require("../../../models/transfer/inventaire/tabInventaireMysql");
const TabInventaireProduitsMysql = require("../../../models/transfer/inventaire/tabInventaireProduits.Mysql");
const AdUserRepository = require("../../../repositories/AdUserRepository");

module.exports = {
  getProductSearch: async (req, res) => {
    var result = await TabInventaire.selectProductByLikeName(req.body.name);
    return res.status(200).send(result);
  },
  getDetailProduct: async (req, res) => {
    var result = await TabInventaire.selectDetailProductById(req.body.m_product_id);
    return res.status(200).send(result);
  },
  syncDataInventory: async (req, res) => {
    try {
      var result = await TabInventaireMysql.insert(req.body);
      res.status(200).send({ message: "", result: result.affectedRows });
    } catch (error) {
      throw error;
    }
  },

  // hadjer
  addNewLineInventorProduct: async (req, res) => {
    // createdBy ad_user_id-indice
    const inventaireProduit = ({ ad_user_id, userName, m_product_id, name, m, createdBy } = req.body);
    inventaireProduit.userName = await AdUserRepository.getUserName(ad_user_id);
    var result = await TabInventaireProduitsMysql.insert(inventaireProduit);
    return res.status(200).send({ message: "", result: result.affectedRows });
  },
  getListTiersInventor: async (req, res) => {
    var result = await AdUserRepository.GetListUserInventory();
    return res.status(200).send({ message: "", result });
  },

  modifyIsFinished: async (req, res) => {
    var result = await TabInventaireProduitsMysql.modifyIsFinished(req.body);
    return res.status(200).send({ message: "", result: result.affectedRows });
  },

  deleteLineInventoryProduct: async (req, res) => {
    var result = await TabInventaireProduitsMysql.deleteLineInventory(req.body);
    return res.status(200).send({ message: "", result: result.affectedRows });
  },

  getListProductInventoryByDate: async (req, res) => {
    try {
      const { isFinished, from, to, ad_user_id, ad_role_id } = req.body;

      const body = {
        isFinished: isFinished,
        from: from == "" ? getFormattedSysDate(0) : formatAndManipulateDate(from, 0),
        to: to == "" ? getFormattedSysDate(1) : formatAndManipulateDate(to, 1),
        ad_user_id,
        ad_role_id,
      };
      const result =
        ad_role_id === "1002352"
          ? await TabInventaireMysql.selectInventoryProductByAdUser(body)
          : await TabInventaireMysql.selectInventoryProductByDate(body);
      return res.status(200).send(result);
    } catch (error) {
      console.error("Error fetching product inventory:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  },
};

function getFormattedSysDate(number) {
  const now = new Date();

  const day = String(now.getDate() + number).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `${year}/${month}/${day}`;
}

function formatAndManipulateDate(dateString, daysToAdd) {
  const splitDate = dateString.split("/");

  // Format date to 'YYYY/MM/DD 00:00:00'
  const year = splitDate[2];
  const month = splitDate[1];
  const day = parseInt(splitDate[0]) + daysToAdd;
  const formattedDate = `${year}/${month}/${day}`;

  return formattedDate;
}
