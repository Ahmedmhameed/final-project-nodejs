const { Article } = require("../models");
const createHttpError = require("http-errors");
const { paginnationValidator } = require("../validators");

const getArticles = (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  const validationResult = paginnationValidator.validate({ page, limit });
  if (validationResult.error) {
    page = 1;
    limit = 10;
  }
  Article.getAllArticles(page, limit)
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
