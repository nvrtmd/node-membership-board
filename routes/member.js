const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isSignedIn } = require("./middlewares");
const { Member, Post } = require("../models/index");

/**
 * 회원 정보 조회
 */
router.get("/info", isSignedIn, async (req, res) => {
  const token = req.headers.cookie.split("=")[1];
  const signedinId = await Member.findOne({
    where: { member_id: jwt.decode(token).memberId },
  });

  const signedinMemberInfo = await Member.findByPk(signedinId.id, {
    attributes: ["member_id", "member_nickname"],
  });

  res.status(200).json({
    code: 200,
    data: signedinMemberInfo,
  });
});

module.exports = router;
