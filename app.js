const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./models/index.js").sequelize;

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

sequelize.sync();

app.use(
  cors({
    origin: [process.env.FRONT_URL, "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);
// app.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });

module.exports = app;
