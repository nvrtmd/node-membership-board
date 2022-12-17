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
  const signedinMember = await Member.findOne({
    where: { member_id: jwt.decode(token).memberId },
  });

  const signedinMemberInfo = await Member.findByPk(signedinMember.id, {
    attributes: ["member_id", "member_nickname"],
  });

  res.status(200).json({
    code: 200,
    data: signedinMemberInfo,
  });
});

/**
 * 회원 게시글 조회
 */
router.get("/posts", isSignedIn, async (req, res) => {
  const token = req.headers.cookie.split("=")[1];
  const signedinMemberInfo = await Member.findOne({
    where: { member_id: jwt.decode(token).memberId },
  });

  const posts = await await Post.findAll({
    where: {
      memberId: signedinMemberInfo.id,
    },
    include: [
      {
        model: Member,
        as: "writer",
        attributes: ["member_id", "member_nickname"],
      },
    ],
  });

  res.status(200).json({
    code: 200,
    data: posts,
  });
});

module.exports = router;
