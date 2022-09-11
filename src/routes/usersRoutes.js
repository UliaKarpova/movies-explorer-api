const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUserInfo, getUserInfo,
} = require('../controllers/usersController');
const {
  nameMinError, nameMaxError, emailUncorrectedError, nameRequiredError, emailRequiredError,
} = require('../utils/messages');

userRoutes.get('/users/me', getUserInfo);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.required': nameRequiredError,
        'string.min': nameMinError,
        'string.max': nameMaxError,
      }),
    email: Joi.string().email({ tlds: { allow: false } }).required()
      .messages({
        'string.required': emailRequiredError,
        'string.email': emailUncorrectedError,
      }),
  }),
}), updateUserInfo);

module.exports = userRoutes;
