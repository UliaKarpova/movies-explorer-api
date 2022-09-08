const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const NeedAutarizationError = require('../errors/NeedAutarizationError');

const needAutarizationErrorMessage = 'Необходима авторизация';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new NeedAutarizationError(needAutarizationErrorMessage);
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev_secret');
  } catch (err) {
    throw new NeedAutarizationError(needAutarizationErrorMessage);
  }
  req.user = payload;
  next();
};
