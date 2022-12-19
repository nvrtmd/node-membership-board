const express = require("express");
const router = express.Router();
const { verify } = require("../modules/jwt");
const { isSignedIn } = require("./middlewares");
const { Member, Post } = require("../models/index");

/**
 * 게시글 목록 조회
 */
router.get("/list", async (req, res) => {
  const postList = await Post.findAll();
  return res.status(200).json({
    code: 200,
    data: postList,
  });
});

/**
 * 게시글 생성
 */
router.post("/create", isSignedIn, async (req, res) => {
  const signedinId = verify(res.locals.token).memberId;

  const writer = await Member.findOne({
    where: { member_id: signedinId },
  });

  const post = {
    post_title: req.body.title,
    post_contents: req.body.contents,
    member_idx: writer.member_idx,
  };

  await Post.create(post);
  return res.status(201).json({
    code: 201,
    message: "create post successfully.",
  });
});

module.exports = router;
