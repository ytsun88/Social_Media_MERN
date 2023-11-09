const Joi = require("joi");

const registerValidator = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    birthday: Joi.date().required().less(Date.now()),
    email: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

const loginValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidator = registerValidator;
module.exports.loginValidator = loginValidator;
