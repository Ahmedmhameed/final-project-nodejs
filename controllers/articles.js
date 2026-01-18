const { Article } = require("../models");

const getArticles = (req, res, next) => {
  Article.getAllArticles()
    .then((result) => {
      if (result.status) {
        res.status(200).json({ status: true, data: result.data });
      } else {
        next(createHttpError(500, result.message));
      }
    })
    .catch((err) => {
      next(createHttpError(500, err.message));
    });
};
const getArticle = (req, res, next) => {
  const _article_id = req.params.id;
  if (!_article_id) next(createHttpError(500, "ID is required"));

  Article.getArticle(_article_id)
    .then((result) => {
      if (result.status) {
        res.status(200).json({ status: true, data: result.data });
      } else {
        next(createHttpError(500, result.message));
      }
    })
    .catch((err) => {
      next(createHttpError(500, err.message));
    });
};

module.exports = {
  getArticles,
  getArticle,
};
