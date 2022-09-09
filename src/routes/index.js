const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersRouter = require('./usersRoutes');
const moviesRouter = require('./moviesRoutes');
const auth = require('../middlewares/auth');
const {
  login, logout, createUser,
} = require('../controllers/usersController');

const {
  notFoundErrorMessageForRoute,
  emailRequiredError,
  emailUncorrectError,
  passwordRequiredError,
  nameRequiredError,
  nameMinError,
  nameMaxError,
} = require('../utils/messages');

const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required()
      .messages({
        'string.required': emailRequiredError,
        'string.email': emailUncorrectError,
      }),
    password: Joi.string().required()
      .messages({
        'string.required': passwordRequiredError,
      }),
  }),
}), login);

router.post('/signup', celebrate({
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
        'string.email': emailUncorrectError,
      }),
    password: Joi.string().required()
      .messages({
        'string.required': passwordRequiredError,
      }),
  }),
}), createUser);

router.use(auth);

router.post('/signout', logout);
router.use(usersRouter);
router.use(moviesRouter);
router.use('/', () => {
  throw new NotFoundError(notFoundErrorMessageForRoute);
});

module.exports = router;
