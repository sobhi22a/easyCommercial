const oracle = require('../config/oracle/oracledb');
const C_PAYMENT = oracle.models.C_PAYMENT;
module.exports.CPaymentRepository = async (data) => {
const t = await oracle.sequelize.transaction();
  try {
    await oracle.sequelize.query('LOCK TABLE C_PAYMENT IN SHARE MODE', { transaction: t });
        const selectPayment = await C_PAYMENT.findOne({
            where: { C_BPARTNER_ID: data.C_BPARTNER_ID },
            order: [ ['C_PAYMENT_ID', 'DESC'] ],
            limit: 1,
            lock: true,
            transaction: t,
        });
        const update = await C_PAYMENT.update(
            { C_INVOICE_ID: data.C_INVOICE_ID },
            { where: { C_PAYMENT_ID: selectPayment.dataValues.C_PAYMENT_ID },
                lock: true,
                transaction: t,
            }
        )
        await t.commit();
        return update[0];
    } catch (error) {
        console.error(error);
        await t.rollback();
    } 
};