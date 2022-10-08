const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const NotFoundError = require('../errors/NotFoundError');
const UncorrectedDataError = require('../errors/UncorrectedDataError');
const UserAlreadyExistsError = require('../errors/UserAlreadyExistsError');
/* const NeedAutarizationError = require('../errors/NeedAutarizationError'); */
const { devSecretKey } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  uncorrectedDataErrorMessage,
  notFoundErrorMessageForUser,
  /* uncorrectedEmailOrPasswordMessage, */
  userAlreadyExistsMessage,
  authCorrect,
  logoutCorrect,
} = require('../utils/messages');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : devSecretKey,
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        sameSite: 'none',
        httpOnly: true,
        secure: false,
      });
      res.send({ message: authCorrect });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: false,
  });
  res.send({ message: logoutCorrect });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(200).send({
        data: {
          name, email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserAlreadyExistsError(userAlreadyExistsMessage));
      } else if (err.name === 'ValidationError') {
        next(new UncorrectedDataError(uncorrectedDataErrorMessage));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name,
    email,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      const userName = user.name;
      const userEmail = user.email;
      res.send({ name: userName, email: userEmail });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserAlreadyExistsError(userAlreadyExistsMessage));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new UncorrectedDataError(uncorrectedDataErrorMessage));
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundErrorMessageForUser);
      }
      const { name, email } = user;
      res.send({ name, email });
    })
    .catch(next);
};
