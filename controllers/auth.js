const createHttpError = require("http-errors");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

const signUp = (req, res, next) => {
  const userData = req.body;

  const validateResult = User.validate(userData);
  if (validateResult.error) {
    return next(createHttpError(400, validateResult.error.message));
  }

  const user = new User(userData);
  user
    .isExist()
    .then((result) => {
      if (result.check === true) {
        return next(createHttpError(409, result.message)); // 409 Conflict is more appropriate
      }

      user.save((status) => {
        if (status.status) {
          res.status(201).json({
            status: true,
            message: "User has been created successfully",
          });
        } else {
          next(createHttpError(500, status.message));
        }
      });
    })
    .catch((err) => {
      const msg = err.message || "Unexpected error";
      next(createHttpError(400, msg));
    });
};

const login = (req, res, next) => {
  const loginData = req.body;
  User.login(loginData)
    .then((result) => {
      if (result.status) {
        const jwtSecretKey = process.env.PRIVATE_KEY;
        const myToken = jwt.sign(
          {
            _id: result.data._id,
          },
          jwtSecretKey,
        );
        res.status(200).json({ status: true, token: myToken });
      } else {
        next(createHttpError(result.code, result.message));
      }
    })
    .catch((err) => {
      next(createHttpError(400, err.message));
    });
};

module.exports = { signUp, login };
