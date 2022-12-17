const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { isSignedIn } = require("./middlewares");

const { Member, Post } = require("../models/index");

router.post("/create", isSignedIn, async (req, res) => {
  const token = req.headers.cookie.split("=")[1];
  const signedinId = jwt.decode(token).memberId;

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
