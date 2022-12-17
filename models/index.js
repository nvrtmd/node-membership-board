const Sequelize = require("sequelize");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const Post = require("./post");
const Member = require("./member");

const config = require(path.join(__dirname, "..", "config", "database.js"))[
  env
];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {
  sequelize,
  Sequelize,
  Post: Post(sequelize, Sequelize),
  Member: Member(sequelize, Sequelize),
};

db.Member.hasMany(db.Post, {
  foreignKey: "member_idx",
  onDelete: "cascade",
});
db.Post.belongsTo(db.Member, {
  foreignKey: "member_idx",
  as: "post_writer",
});

module.exports = db;
