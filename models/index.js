const Sequelize = require("sequelize");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const Member = require("./member");
const Post = require("./post");

const config = require(path.join(__dirname, "..", "config", "database.js"))[
  env
];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

Member.hasMany(Post);
Post.belongsTo(Member);

const db = {
    sequelize,
    Sequelize,
    Post: Post(sequelize, Sequelize),
    Member: Member(sequelize, Sequelize)
};

module.exports = db;
