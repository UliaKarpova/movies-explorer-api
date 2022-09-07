const errorMessage = 'Произошла ошибка';

function errorProcessing(err, req, res, next) {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? errorMessage : message });
  next();
}

module.exports = errorProcessing;
