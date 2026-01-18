const Joi = require("@hapi/joi");

const schema = Joi.object({
  username: Joi.string().min(3).max(10).alphanum().required(),
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/))
    .message("Password Not Don't match our pattern")
    .required(),
});

module.exports = schema;
