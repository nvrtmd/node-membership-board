module.exports = (sequelize, DataTypes) => {
  return sequelize.define("member", {
    member_idx: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    member_password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    member_nickname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  });
};
