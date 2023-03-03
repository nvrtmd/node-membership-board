const bcrypt = require("bcryptjs");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { verify } = require("../modules/jwt");
const { Member, Post, Comment } = require("../models");

exports.isExistedId = async (req, res, next) => {
  try {
    const accordMember = await Member.findOne({
      where: { member_id: req.body.id },
    });
    if (accordMember) {
      return next();
    } else {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

exports.checkIdDuplication = async (req, res, next) => {
  try {
    if (req.headers.cookie) {
      // signed in user
      const token = req.headers.cookie.split("=")[1];
      const signedInMemberId = verify(
        token,
        process.env.JWT_SECRET_KEY
      ).memberId;
      if (signedInMemberId === req.body.id) {
        return next();
      }
    }

    const accordMember = await Member.findOne({
      where: { member_id: req.body.id },
    });
    if (accordMember) {
      return res.status(StatusCodes.CONFLICT).send(ReasonPhrases.CONFLICT);
    } else {
      return next();
    }
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

exports.isCorrectPassword = async (req, res, next) => {
  try {
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
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
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
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(ReasonPhrases.UNAUTHORIZED);
    }
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
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
    return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

exports.isPostWriter = async (req, res, next) => {
  try {
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
    return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

exports.isCommentWriter = async (req, res, next) => {
  try {
    const commentIdx = req.params.commentIdx;
    const token = req.headers.cookie.split("=")[1];
    const signedInMemberId = verify(token, process.env.JWT_SECRET_KEY).memberId;
    const signedInMember = await Member.findOne({
      where: { member_id: signedInMemberId },
    });
    const comment = await Comment.findOne({
      where: { comment_idx: commentIdx },
    });
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
    return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
