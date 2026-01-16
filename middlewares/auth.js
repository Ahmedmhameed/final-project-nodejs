const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { readFileSync } = require("fs");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    next(createHttpError(401));
    return;
  }
  const token = authHeader.split(" ")[1];
  const tokenSecretKey = process.env.PRIVATE_KEY;

  try {
    const decode = jwt.verify(token, tokenSecretKey);
    req.user_id = decode._id;
    next();
  } catch (err) {
    next(createHttpError(401, err.message));
  }
};
