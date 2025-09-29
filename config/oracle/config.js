const dotenv = require("dotenv");
dotenv.config();

module.exports.database = {
  dialect: process.env.ORALCE_DIALECT,
  username: process.env.ORACLE_DB_NAME_PROD,
  password: process.env.ORACLE_DB_PASSWORD_PROD,
  logging: false,
  dialectOptions: {
    connectString: `${process.env.ORACLE_DB_HOST_REMOTE_PROD}:${process.env.ORACLE_DB_PORT}/${process.env.ORACLE_DB_SERVICENAME_PROD}`,
  },
};
