require("dotenv").config();
const env = process.env;

const development = {
  username: env.USER_NAME,
  password: env.USER_PASSWORD,
  database: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: "mysql",
  timezone: "+09:00",
};

const production = {
  username: env.USER_NAME,
  password: env.USER_PASSWORD,
  database: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: "mysql",
};

const test = {
  username: env.USER_NAME,
  password: env.USER_PASSWORD,
  database: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: "mysql",
};

module.exports = { development, production, test };
