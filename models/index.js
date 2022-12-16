const Sequelize = require("sequelize");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "..", "config", "database.js"))[
  env
];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Post = require("./post")(sequelize, Sequelize);
db.Member = require("./member")(sequelize, Sequelize);

db.Member.hasMany(db.Post, {foreignKey:'member_id', sourceKey: 'member_id'});
db.Post.belongsTo(db.Member, {foreignKey:'member_id', sourceKey: 'member_id'});

module.exports = db;
