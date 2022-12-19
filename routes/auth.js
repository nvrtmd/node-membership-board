const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isExistedId, isCorrectPassword, isSignedIn } = require("./middlewares");

const { Member } = require("../models/index");

/**
 * 회원가입
 */
router.post("/signup", async (req, res, next) => {
  const encodedPassword = await bcrypt.hash(req.body.password, 12);
  const newMember = {
    member_id: req.body.id,
    member_nickname: req.body.nickname,
    member_password: encodedPassword,
  };
  await Member.create(newMember);

  return res.status(201).json({
    code: 201,
    message: "created successfully.",
  });
});

/**
 * 로그인
 */
router.post(
  "/signin",
  isExistedId,
  isCorrectPassword,
  async (req, res, next) => {
    const memberId = {
      memberId: req.body.id,
    };

    const token = jwt.sign(memberId, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
      issuer: process.env.JWT_ISSUER,
    });

    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=none; secure=true;`
    );

    return res.status(201).json({
      code: 201,
      message: "signed in successfully.",
    });
  }
);

/**
 * 로그아웃
 */
router.get("/signout", isSignedIn, async (req, res, next) => {
  res.setHeader(
    "Set-Cookie",
    `token=${res.locals.token}; Path=/; HttpOnly; SameSite=none; secure=true; Max-Age=0`
  );

  return res.status(200).json({
    code: 200,
    message: "signed out successfully.",
  });
});

module.exports = router;
