const Movie = require('../models/movieSchema');
const UncorrectedDataError = require('../errors/UncorrectedDataError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenDeleteCardError = require('../errors/ForbiddenDeleteCardError');

const {
  uncorrectedDataErrorMessage,
  notFoundErrorMessageForVideo,
  forbiddenDeleteCardErrorMessage,
  movieRemoved,
} = require('../utils/messages');

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => {
      res.status(200).send({ movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UncorrectedDataError(uncorrectedDataErrorMessage));
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
        .then(() => res.send({ message: movieRemoved }));
    })
    .catch((err) => {
      next(err);
    });
};
