const jwt = require("jsonwebtoken");

exports.sign = (payload) => {
  const signedToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
    issuer: process.env.JWT_ISSUER,
  });

  return signedToken;
};

exports.verify = (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    if (err.message === "jwt expired") {
      throw new Error("token was expired. fail to verify.");
    } else {
      throw new Error("token is invalid. fail to verify.");
    }
  }
  return decoded;
};
