module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
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
      tableName: "posts",
      deletedAt: "deletedAt",
      paranoid: true,
      timestamps: true,
    }
  );
  return Post;
};
