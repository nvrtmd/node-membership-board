module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    "member",
    {
      member_idx: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
    },
    {
      tableName: "members",
      deletedAt: "deletedAt",
      paranoid: true,
      timestamps: true,
    }
  );
  return Member;
};
