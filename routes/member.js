const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {} = require("./middlewares");

const { Member } = require("../models/index");

/**
 * 회원가입
 */
router.post("/signup", async (req, res, next) => {
  const encodedPassword = await bcrypt.hash(req.body.password, 12);
  const newMemberData = {
    member_id: req.body.id,
    member_name: req.body.name,
    member_password: encodedPassword,
  };
  await Member.create(newMemberData);

  return res.status(201).json({
    code: 201,
    message: "created successfully.",
  });
});

module.exports = router;
