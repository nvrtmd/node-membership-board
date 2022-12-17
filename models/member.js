module.exports = (sequelize, DataTypes) => {
  return sequelize.define("member", {
    member_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
