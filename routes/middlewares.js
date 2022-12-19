const bcrypt = require("bcryptjs");
const { verify } = require("../modules/jwt");
const { Member, Post, Comment } = require("../models");

exports.isExistedId = async (req, res, next) => {
  const accordMember = await Member.findOne({
    where: { member_id: req.body.id },
  });
  if (accordMember) {
    return next();
  } else {
    return res.status(404).json({
      code: 404,
      message: "id doesn't exist.",
    });
  }
};

exports.isCorrectPassword = async (req, res, next) => {
  const accordMember = await Member.findOne({
    where: { member_id: req.body.id },
  });

  const isCorrectPassword = await bcrypt.compare(
    req.body.password,
    accordMember.member_password
  );

  if (isCorrectPassword) {
    return next();
  } else {
    return res.status(404).json({
      code: 404,
      message: "password isn't correct.",
    });
  }
};

exports.isSignedIn = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split("=")[1];
    try {
      verify(token, process.env.JWT_SECRET_KEY);
      res.locals.token = token;
      next();
    } catch {
      return res.status(401).json({
        code: 401,
        message: "unauthorized user. Need to sign in.",
      });
    }
  } catch {
    return res.status(401).json({
      code: 401,
      message: "unauthorized user. Need to sign in.",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  const token = req.headers.cookie.split("=")[1];
  const signedInMemberId = verify(token, process.env.JWT_SECRET_KEY).memberId;
  const signedInMember = await Member.findOne({
    where: { member_id: signedInMemberId },
  });
  const admin = await Member.findOne({ where: { member_id: "admin" } });

  if (
    signedInMemberId === "admin" &&
    signedInMember.member_password === admin.member_password
  ) {
    return next();
  }
  return res.status(403).json({
    code: 403,
    message: "forbidden to access.",
  });
};

exports.isPostWriter = async (req, res, next) => {
  const postIdx = req.params.postIdx;
  const token = req.headers.cookie.split("=")[1];
  const signedInMemberId = verify(token, process.env.JWT_SECRET_KEY).memberId;
  const signedInMember = await Member.findOne({
    where: { member_id: signedInMemberId },
  });
  const post = await Post.findOne({ where: { post_idx: postIdx } });
  const postWriterIdx = post.member_idx;
  const postWriter = await Member.findOne({
    where: { member_idx: postWriterIdx },
  });

  if (
    signedInMemberId === postWriter.member_id &&
    signedInMember.member_password === postWriter.member_password
  ) {
    return next();
  }
  return res.status(403).json({
    code: 403,
    message: "forbidden to access.",
  });
};

exports.isCommentWriter = async (req, res, next) => {
  const commentIdx = req.params.commentIdx;
  const token = req.headers.cookie.split("=")[1];
  const signedInMemberId = verify(token, process.env.JWT_SECRET_KEY).memberId;
  const signedInMember = await Member.findOne({
    where: { member_id: signedInMemberId },
  });
  const comment = await Comment.findOne({ where: { comment_idx: commentIdx } });
  const commentWriterIdx = comment.member_idx;
  const commentWriter = await Member.findOne({
    where: { member_idx: commentWriterIdx },
  });

  if (
    signedInMemberId === commentWriter.member_id &&
    signedInMember.member_password === commentWriter.member_password
  ) {
    return next();
  }
  return res.status(403).json({
    code: 403,
    message: "forbidden to access.",
  });
};
