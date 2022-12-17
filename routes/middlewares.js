const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Member } = require("../models");

exports.isExistedId = async (req, res, next) => {
  const memberData = await Member.findOne({
    where: { member_id: req.body.id },
  });
  if (memberData) {
    return next();
  } else {
    return res.status(404).json({
      code: 404,
      message: "id doesn't exist.",
    });
  }
};

exports.isCorrectPassword = async (req, res, next) => {
  const memberData = await Member.findOne({
    where: { member_id: req.body.id },
  });

  const isCorrectPassword = await bcrypt.compare(
    req.body.password,
    memberData.member_password
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
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
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
