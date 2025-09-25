const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class C_PAYMENT extends Model {
    }
    C_PAYMENT.init({
        C_PAYMENT_ID: {
            type: DataTypes.NUMBER({ length: 10 }),
            primaryKey: true
        },
        ISACTIVE: {
            type: DataTypes.CHAR({ length: 1 })
        },
        C_INVOICE_ID: {
            type: DataTypes.NUMBER({ length: 60 })
        },
        C_BPARTNER_ID: {
            type: DataTypes.NUMBER({ length: 60 })
        },
        CREATED: {
            type: DataTypes.DATE()
        }
    }, {
        sequelize,
    });

    return C_PAYMENT;
}
