const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const {
  isExistedId,
  isCorrectPassword,
  isSignedIn,
  checkIdDuplication,
} = require("./middlewares");
const { sign } = require("../modules/jwt");

const { Member } = require("../models/index");

/**
 * 회원가입
 */
router.post("/signup", checkIdDuplication, async (req, res, next) => {
  try {
    const encodedPassword = await bcrypt.hash(req.body.password, 12);
    const newMember = {
      member_id: req.body.id,
      member_nickname: req.body.nickname,
      member_password: encodedPassword,
    };
    await Member.create(newMember);

    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 로그인
 */
router.post(
  "/signin",
  isExistedId,
  isCorrectPassword,
  async (req, res, next) => {
    try {
      const memberId = {
        memberId: req.body.id,
      };
      const token = sign(memberId);
      res.setHeader(
        "Set-Cookie",
        `token=${token}; Path=/; HttpOnly; SameSite=none; secure=true;`
      );
      return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    } catch {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
);

/**
 * 로그아웃
 */
router.get("/signout", isSignedIn, async (req, res, next) => {
  try {
    res.setHeader(
      "Set-Cookie",
      `token=${res.locals.token}; Path=/; HttpOnly; SameSite=none; secure=true; Max-Age=0`
    );

    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
