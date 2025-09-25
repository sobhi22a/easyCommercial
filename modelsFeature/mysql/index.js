const dbConfig = require("../../config/mySql/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

 db.Parametres = require("./parametres.model")(sequelize, Sequelize);
 db.Xx_quotaref = require("./xx_quotaref.model")(sequelize, Sequelize);
 db.Conditions = require("./conditions.model")(sequelize, Sequelize);
 db.Inventaire = require("./inventaire.model")(sequelize, Sequelize);
 db.Users = require("./users.model")(sequelize, Sequelize);
 db.InventaireProduits = require("./inventaireProduits.model")(sequelize, Sequelize);

module.exports = db;