module.exports = (sequelize, DataTypes) => {
  return sequelize.define("member", {
    member_idx: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    member_password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    member_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  });
};
