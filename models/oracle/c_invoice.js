const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class C_INVOICE extends Model {
    }
    C_INVOICE.init({
        C_INVOICE_ID: {
            type: DataTypes.NUMBER({ length: 10 }),
            primaryKey: true
        },
        C_DOCTYPE_ID: {
            type: DataTypes.NUMBER({ length: 10 }),
            primaryKey: true
        },
        DOCUMENTNO: {
            type: DataTypes.CHAR({ length: 30 })
        },
        ISACTIVE: {
            type: DataTypes.CHAR({ length: 1 })
        },
        C_BPARTNER_ID: {
            type: DataTypes.NUMBER({ length: 60 })
        },
        GRANDTOTAL: {
            type: DataTypes.DOUBLE
        },
        REST: {
            type: DataTypes.DOUBLE
        },
        ISPAID: {
            type: DataTypes.CHAR({ length: 1 })
        },
        ISRETURNTRX: {
            type: DataTypes.CHAR({ length: 1 })
        },
        ISSOTRX: {
            type: DataTypes.CHAR({ length: 1 })
        },
        CREATED: {
            type: DataTypes.DATE
        },
    }, {
        sequelize,
    });

    return C_INVOICE;
}
