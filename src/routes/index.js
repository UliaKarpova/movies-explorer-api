const router = require('express').Router();

const usersRouter = require('./usersRoutes');
const moviesRouter = require('./moviesRoutes');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { notFoundErrorMessageForRoute } = require('../utils/messages');
const { createUserValidation, loginValidation } = require('../validation/userValidation');
const {
  login, logout, createUser,
} = require('../controllers/usersController');

router.post('/signup', createUserValidation, createUser);

router.post('/signin', loginValidation, login);

router.use(auth);

router.post('/signout', logout);
router.use(usersRouter);
router.use(moviesRouter);
router.use('/', () => {
  throw new NotFoundError(notFoundErrorMessageForRoute);
});

module.exports = router;
