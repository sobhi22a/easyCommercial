const oracle = require('../config/oracle/oracledb');
const AD_SEQUENCE = oracle.models.AD_SEQUENCE;
module.exports.AdSequenceRepository = async () => {
    const t = await oracle.sequelize.transaction();
  try {
    await oracle.sequelize.query('LOCK TABLE AD_SEQUENCE IN SHARE MODE', { transaction: t });
        const select = await AD_SEQUENCE.findOne({
            where: { AD_SEQUENCE_ID: 1006376 },
            lock: true,
            transaction: t,
        });
        const update = await AD_SEQUENCE.update(
            { CURRENTNEXT: select.dataValues.CURRENTNEXT + select.dataValues.INCREMENTNO },
            { where: { AD_SEQUENCE_ID: 1006376 },
                lock: true,
                transaction: t,
            }
        )
        const select2 = await AD_SEQUENCE.findOne({
            where: { AD_SEQUENCE_ID: 1006376 },
            lock: true,
            transaction: t,
        });
        await t.commit();
        return select2.dataValues.CURRENTNEXT;
    } catch (error) {
        console.error(error);
        await t.rollback();
    } 
};