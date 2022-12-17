const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {} = require("./middlewares");

const { Member } = require("../models/index");

/**
 * 회원가입
 */
