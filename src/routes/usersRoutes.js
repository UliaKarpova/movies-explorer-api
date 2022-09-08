const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUserInfo, getUserInfo,
} = require('../controllers/usersController');

userRoutes.get('/users/me', getUserInfo);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email({ tlds: { allow: false } }),
  }),
}), updateUserInfo);

module.exports = userRoutes;
