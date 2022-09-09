const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersRouter = require('./usersRoutes');
const moviesRouter = require('./moviesRoutes');
const auth = require('../middlewares/auth');
const {
  login,  logout, createUser,
} = require('../controllers/usersController');

const notFoundErrorMessage = 'Роут не найден';
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required()
      .messages({
        'string.required': 'Поле email обязательно для заполнения',
        'string.email': 'Email указан неверно',
      }),
    password: Joi.string().required()
      .messages({
        'string.required': 'Поле password обязательно для заполнения',
      }),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.required': 'Поле name обязательно для заполнения',
        'string.min': 'Имя должно быть длинее 2 символов',
        'string.max': 'Имя не может быть длинее 30 символов',
      }),
    email: Joi.string().email({ tlds: { allow: false } }).required()
      .messages({
        'string.required': 'Поле email обязательно для заполнения',
        'string.email': 'Email указан неверно',
      }),
    password: Joi.string().required()
      .messages({
        'string.required': 'Поле password обязательно для заполнения',
      }),
  }),
}), createUser);

router.use(auth);

router.post('/signout', logout);
router.use(usersRouter);
router.use(moviesRouter);
router.use('/', () => {
  throw new NotFoundError(notFoundErrorMessage);
});

module.exports = router;
