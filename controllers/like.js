const createHttpError = require("http-errors");
const { Like, Article } = require("../models");

const addLike = (req, res, next) => {
  const likeData = req.body;

  likeData._user_id = req._user_id;
  const validateResult = Like.validate(likeData);
  if (validateResult.error) {
    return next(createHttpError(400, validateResult.error.message));
  }
  const like = new Like(likeData);
  like.isExist().then((result) => {
    if (result.check === true) {
      like.likeData._id = result._like_id;
      like.remove((status) => {
        if (status.status) {
          Article.updateLikes(likeData._article_id, Math.max(-1, 0));
          return res.status(201).json({
            status: true,
          });
        } else {
          return next(createHttpError(500, status.message));
        }
      });
    } else
      like.save((status) => {
        if (status.status) {
          Article.updateLikes(likeData._article_id, 1);
          return res.status(201).json({
            status: true,
          });
        } else {
          return next(createHttpError(500, status.message));
        }
      });
  });
};
module.exports = { addLike };
