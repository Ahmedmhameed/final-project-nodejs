const Joi = require("@hapi/joi");

const schema = Joi.object({
  title: Joi.string().min(3).required(),
  link: Joi.string().uri().required(),
  date: Joi.date().required(),
  likes: Joi.number().min(0),
});

module.exports = schema;
