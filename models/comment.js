module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "comment",
    {
      comment_idx: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      comment_contents: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "comments",
      deletedAt: "deletedAt",
      paranoid: true,
      timestamps: true,
    }
  );
  return Comment;
};
