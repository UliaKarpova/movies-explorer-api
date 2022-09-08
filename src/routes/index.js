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
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
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
