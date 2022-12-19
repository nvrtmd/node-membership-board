const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Member } = require("../models");

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
      jwt.verify(token, process.env.JWT_SECRET_KEY);
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
  const signedInMemberId = jwt.decode(token).memberId;
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
