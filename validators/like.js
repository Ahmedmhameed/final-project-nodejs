const Joi = require("@hapi/joi");

const schema = Joi.object({
  _user_id: Joi.string().required(),
  _article_id: Joi.string().required(),
});

module.exports = schema;
