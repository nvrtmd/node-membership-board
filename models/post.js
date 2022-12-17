module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "post",
    {
      post_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      post_contents: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
};
