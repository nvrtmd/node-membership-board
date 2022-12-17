const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isSignedIn } = require("./middlewares");
const { Member, Post } = require("../models/index");

/**
 * 회원 정보 조회
 */
router.get("/info", isSignedIn, async (req, res) => {
  const signedinMember = await Member.findOne({
    where: { member_id: jwt.decode(res.locals.token).memberId },
  });

  const signedinMemberInfo = await Member.findByPk(signedinMember.member_idx, {
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
  const signedinMemberInfo = await Member.findOne({
    where: { member_id: jwt.decode(res.locals.token).memberId },
  });

  const posts = await Post.findAll({
    where: {
      member_idx: signedinMemberInfo.member_idx,
    },
    include: [
      {
        model: Member,
        as: "post_writer",
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
