const express = require("express");
const router = express.Router();
const { verify } = require("../modules/jwt");
const { isSignedIn, isAdmin } = require("./middlewares");
const { Member, Post } = require("../models/index");

/**
 * 회원 목록 조회
 */
router.get("/list", isSignedIn, isAdmin, async (req, res) => {
  const memberList = await Member.findAll();

  return res.status(200).json({
    code: 200,
    data: memberList,
  });
});

/**
 * 회원 정보 조회
 */
router.get("/info", isSignedIn, async (req, res) => {
  const signedinMember = await Member.findOne({
    where: { member_id: verify(res.locals.token).memberId },
  });

  const signedinMemberInfo = await Member.findByPk(signedinMember.member_idx, {
    attributes: ["member_id", "member_nickname"],
  });

  return res.status(200).json({
    code: 200,
    data: signedinMemberInfo,
  });
});

/**
 * 회원 게시글 조회
 */
router.get("/posts", isSignedIn, async (req, res) => {
  const signedinMemberInfo = await Member.findOne({
    where: { member_id: verify(res.locals.token).memberId },
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

  return res.status(200).json({
    code: 200,
    data: posts,
  });
});

/**
 * 회원 탈퇴
 */
router.delete("/delete", isSignedIn, async (req, res) => {
  const signedinMemberInfo = await Member.findOne({
    where: { member_id: verify(res.locals.token).memberId },
  });

  if (signedinMemberInfo) {
    await Member.destroy({
      where: { member_idx: signedinMemberInfo.member_idx },
    });
    res.setHeader(
      "Set-Cookie",
      `token=${res.locals.token}; Path=/; HttpOnly; SameSite=none; secure=true; Max-Age=0`
    );

    return res.status(200).json({
      code: 200,
      message: "create account successfully.",
    });
  } else {
    return res.status(404).json({
      code: 404,
      message: "cannot find account. please retry.",
    });
  }
});

module.exports = router;
