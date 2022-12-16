const express = require('express');
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const sequelize = require("./models/index.js").sequelize;
require("dotenv").config();

const app = express();

sequelize.sync();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
    cors({
      origin: [process.env.FRONT_URL, "http://localhost:3000"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    })
  );
  
module.exports = app;
