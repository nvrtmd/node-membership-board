const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isSignedIn } = require("./middlewares");
const { Member, Post } = require("../models/index");

/**
 * 게시글 목록 조회
 */
router.get("/list", async (req, res) => {
  const postList = await Post.findAll();
  res.status(200).json({
    code: 200,
    data: postList,
  });
});

/**
 * 게시글 생성
 */
router.post("/create", isSignedIn, async (req, res) => {
  const signedinId = jwt.decode(res.locals.token).memberId;

  const writerId = await Member.findOne({
    where: { member_id: signedinId },
  });

  const postData = {
    post_title: req.body.title,
    post_contents: req.body.contents,
    memberId: writerId.id,
  };

  await Post.create(postData);
});

module.exports = router;
