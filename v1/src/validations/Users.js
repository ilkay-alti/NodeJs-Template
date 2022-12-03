const Joi = require("joi");

const createValidation = Joi.object({
  full_name: Joi.string().required().min(5),
  password: Joi.string().required().min(6),
  email: Joi.string().email().required().min(8),
});

const loginValidation = Joi.object({
  password: Joi.string().required().min(6),
  email: Joi.string().email().required().min(8),
});

const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required().min(8),
});

const updateValidation = Joi.object({
  full_name: Joi.string().min(5),
  email: Joi.string().email().min(8),
});
const changePasswordValidation = Joi.object({
  password: Joi.string().required().min(6),
});

module.exports = {
  createValidation,
  loginValidation,
  resetPasswordValidation,
  updateValidation,
  changePasswordValidation,
};
