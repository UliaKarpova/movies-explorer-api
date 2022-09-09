const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const NotFoundError = require('../errors/NotFoundError');
const UncorrectDataError = require('../errors/UncorrectDataError');
const UserAlreadyExistsError = require('../errors/UserAlreadyExistsError');
const NeedAutarizationError = require('../errors/NeedAutarizationError');
const { devSecretKey } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  uncorrectDataErrorMessage,
  notFoundErrorMessageForUser,
  uncorrectEmailOrPasswordMessage,
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
        secure: true,
      });
      res.send({ message: authCorrect });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NeedAutarizationError(uncorrectEmailOrPasswordMessage));
      } else {
        next(err);
      }
    });
};

module.exports.logout = (req, res, next) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.send({ message: logoutCorrect });
  next();
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
      }).end();
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserAlreadyExistsError(userAlreadyExistsMessage));
      } else if (err.name === 'ValidationError') {
        next(new UncorrectDataError(uncorrectDataErrorMessage));
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
      const { userName, userEmail } = user;
      res.send({ userName, userEmail });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new UncorrectDataError(uncorrectDataErrorMessage));
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  console.log(req.user._id);
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
