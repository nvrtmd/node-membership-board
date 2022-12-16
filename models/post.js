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
        type: DataTypes.STRING,
        allowNull: false,
      },
      post_contents: {
        type: DataTypes.STRING,
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
        comment: "게시글 등록 일시",
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
};
