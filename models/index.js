const Sequelize = require("sequelize");
const path = require("path");
const env = process.env.NODE_ENV || "development";

const config = require(path.join(__dirname, "..", "config", "database.js"))[
  env
];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
