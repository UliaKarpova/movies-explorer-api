const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUserInfo, getUserInfo,
} = require('../controllers/usersController');
const { nameMinError, nameMaxError, emailUncorrectError } = require('../utils/messages');

userRoutes.get('/users/me', getUserInfo);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': nameMinError,
        'string.max': nameMaxError,
      }),
    email: Joi.string().email({ tlds: { allow: false } })
      .messages({
        'string.email': emailUncorrectError,
      }),
  }),
}), updateUserInfo);

module.exports = userRoutes;
