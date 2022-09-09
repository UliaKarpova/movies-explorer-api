const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUserInfo, getUserInfo,
} = require('../controllers/usersController');

userRoutes.get('/users/me', getUserInfo);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Имя должно быть длинее 2 символов',
        'string.max': 'Имя не может быть длинее 30 символов',
      }),
    email: Joi.string().email({ tlds: { allow: false } })
      .messages({
        'string.email': 'Email указан неверно',
      }),
  }),
}), updateUserInfo);

module.exports = userRoutes;
