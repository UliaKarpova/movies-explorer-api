const Movie = require('../models/movieSchema');
const UncorrectDataError = require('../errors/UncorrectDataError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenDeleteCardError = require('../errors/ForbiddenDeleteCardError');

const uncorrectDataErrorMessage = 'Переданы некорректные данные';
const notFoundErrorMessage = 'Карточка не найдена';
const forbiddenDeleteCardErrorMessage = 'Можно удалять только свою карточку';

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;
  console.log(req.body);
  Movie.create({
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner: req.user._id
  })
    .then(() => {
      res.status(200).send({
        data: {
          country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner
        }
       }).end();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UncorrectDataError(uncorrectDataErrorMessage));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ movies }))
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(notFoundErrorMessage);
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenDeleteCardError(forbiddenDeleteCardErrorMessage);
      }
      return movie.remove()
        .then(() => res.send({ message: 'Фильм удалён' }));
    })
    .catch((err) => {
      next(err);
    });
};
