const Movie = require('../models/movieSchema');
const UncorrectDataError = require('../errors/UncorrectDataError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenDeleteCardError = require('../errors/ForbiddenDeleteCardError');

const { uncorrectDataErrorMessage, notFoundErrorMessageForVideo, forbiddenDeleteCardErrorMessage } = require('../utils/errorsMessages');

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailer, nameRu, nameEn, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRu,
    nameEn,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(200).send({ movie }).end();
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
      throw new NotFoundError(notFoundErrorMessageForVideo);
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
