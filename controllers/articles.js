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
        return global.returnJson(res, 200, true, "Success", result.data);
      }
      return next(createHttpError(500, result.message));
    })
    .catch((err) => {
      return next(createHttpError(500, err.message));
    });
};
const getArticle = (req, res, next) => {
  const _article_id = req.params.id;
  if (!_article_id) return next(createHttpError(500, "ID is required"));

  Article.getArticle(_article_id)
    .then((result) => {
      if (result.status) {
        return global.returnJson(res, 200, true, "Success", result.data);
      } else {
        return next(createHttpError(500, result.message));
      }
    })
    .catch((err) => {
      return next(createHttpError(500, err.message));
    });
};

module.exports = {
  getArticles,
  getArticle,
};
