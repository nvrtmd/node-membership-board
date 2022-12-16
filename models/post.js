module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "post",
    {
      post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      post_title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      post_content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      post_views: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      post_display: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        comment: "게시글 게시 여부 - 1 or 0",
      },
      post_register_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
};
