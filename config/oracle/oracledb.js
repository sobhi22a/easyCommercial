const {Sequelize, DataTypes} = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize({
    ...config.database, define: {
        timestamps: false, freezeTableName: true,
    }
});

module.exports = {
    sequelize, models: {
        AD_SEQUENCE: require('../../models/oracle/ad_sequence')(sequelize, DataTypes),
        C_INVOICE: require('../../models/oracle/c_invoice')(sequelize, DataTypes),
        C_PAYMENT: require('../../models/oracle/c_payment')(sequelize, DataTypes),
    },
};