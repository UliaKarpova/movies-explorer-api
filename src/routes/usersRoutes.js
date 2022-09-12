const userRoutes = require('express').Router();
const {
  updateUserInfo, getUserInfo,
} = require('../controllers/usersController');

const { updateUserValidation } = require('../validation/userValidation');

userRoutes.get('/users/me', getUserInfo);

userRoutes.patch('/users/me', updateUserValidation, updateUserInfo);

module.exports = userRoutes;
