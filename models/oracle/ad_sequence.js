const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class AD_SEQUENCE extends Model {
    }
    AD_SEQUENCE.init({
        AD_SEQUENCE_ID: {
            type: DataTypes.NUMBER({ length: 10 }),
            primaryKey: true
        },
        ISACTIVE: {
            type: DataTypes.CHAR({ length: 1 })
        },
        INCREMENTNO: {
            type: DataTypes.NUMBER({ length: 60 })
        },
        CURRENTNEXT: {
            type: DataTypes.NUMBER({ length: 60 })
        },
    }, {
        sequelize,
    });

    return AD_SEQUENCE;
}
