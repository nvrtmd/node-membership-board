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
