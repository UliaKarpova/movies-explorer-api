const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const NeedAuthorizationError = require('../errors/NeedAutarizationError');
const { devSecretKey } = require('../utils/config');

const { needAuthorizationErrorMessage } = require('../utils/messages');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NeedAuthorizationError(needAuthorizationErrorMessage);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devSecretKey);
  } catch (err) {
    throw new NeedAuthorizationError(needAuthorizationErrorMessage);
  }
  req.user = payload;
  next();
};
