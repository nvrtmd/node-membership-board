module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "post",
    {
      post_idx: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
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
      tableName: "posts",
      deletedAt: "deletedAt",
      paranoid: true,
      timestamps: true,
    }
  );
  return Post;
};
