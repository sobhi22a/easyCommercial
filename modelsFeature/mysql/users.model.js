module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    indice: {
      type: DataTypes.STRING,
      length: 255,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      length: 255,
      allowNull: false,
    },
    ad_org_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_dc: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_svc: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bloque: {
      type: DataTypes.CHAR(1),
      defaultValue: "N",
      allowNull: false,
    },
    ad_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Users;
};
