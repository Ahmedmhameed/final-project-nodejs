const Joi = require("@hapi/joi");

const schema = Joi.object({
  page: Joi.number().min(1).required(),
  limit: Joi.number().min(1).required(),
});

module.exports = schema;
