const oracledb = require("oracledb");
oracledb.autoCommit = true;

const dotenv = require("dotenv");
dotenv.config();

const dbConfig = {
  user: process.env.ORACLE_DB_NAME_PROD,
  password: process.env.ORACLE_DB_PASSWORD_PROD,
  connectString: `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)
    (HOST = ${process.env.ORACLE_DB_HOST_REMOTE_PROD})(PORT = ${process.env.ORACLE_DB_PORT}))
    (CONNECT_DATA =(SERVICE_NAME = ${process.env.ORACLE_DB_SERVICENAME_PROD})))`,
};

var connection = oracledb.getConnection(dbConfig);

module.exports = connection;
