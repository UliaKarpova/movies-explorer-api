const Movie = require('../models/movieSchema');
const UncorrectDataError = require('../errors/UncorrectDataError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenDeleteCardError = require('../errors/ForbiddenDeleteCardError');

const uncorrectDataErrorMessage = 'Переданы некорректные данные';
const notFoundErrorMessage = 'Карточка не найдена';
const forbiddenDeleteCardErrorMessage = 'Можно удалять только свою карточку';

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId  } = req.body;
  Movie.create({
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner: req.user._id
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
    .then((movies) => res.send({ data: movies }))
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

/* module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(notFoundErrorMessage);
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new UncorrectDataError(uncorrectDataErrorMessage));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(notFoundErrorMessage);
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new UncorrectDataError(uncorrectDataErrorMessage));
      } else {
        next(err);
      }
    });
}; */
