const { celebrate, Joi } = require('celebrate');
const {
  nameMinError,
  nameMaxError,
  emailUncorrectedError,
  nameRequiredError,
  emailRequiredError,
  passwordRequiredError,
} = require('../utils/messages');

module.exports.updateUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } })
      .messages({
        'any.required': emailRequiredError,
        'string.email': emailUncorrectedError,
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': nameRequiredError,
        'string.min': nameMinError,
        'string.max': nameMaxError,
      }),
  }),
});

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'any.required': nameRequiredError,
        'string.min': nameMinError,
        'string.max': nameMaxError,
      }),
    email: Joi.string().email({ tlds: { allow: false } }).required()
      .messages({
        'any.required': emailRequiredError,
        'string.email': emailUncorrectedError,
      }),
    password: Joi.string().required()
      .messages({
        'any.required': passwordRequiredError,
      }),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required()
      .messages({
        'any.required': emailRequiredError,
        'string.email': emailUncorrectedError,
      }),
    password: Joi.string().required()
      .messages({
        'any.required': passwordRequiredError,
      }),
  }),
});
