const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const NeedAutarizationError = require('../errors/NeedAutarizationError');
const { devSecretKey } = require('../utils/config');

const { needAuthorizationErrorMessage } = require('../utils/messages');

module.exports = (req, res, next) => {
  const { autorization } = req.headers;
  if (!autorization || !autorization.startsWith('Bearer ')) {
    throw new NeedAutarizationError(needAuthorizationErrorMessage);
  }
  const token = autorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devSecretKey);
  } catch (err) {
    throw new NeedAutarizationError(needAuthorizationErrorMessage);
  }
  req.user = payload;
  next();
};
