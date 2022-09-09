const movieRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regex = require('../utils/regex');

const {
  createMovie, getMovies, deleteMovieById,
} = require('../controllers/moviesController');

const {
  countryRequiredError,
  directorRequiredError,
  durationRequiredError,
  yearRequiredError,
  descriptionRequiredError,
  imageRequiredError,
  imageUncorrectError,
  trailerRequiredError,
  trailerUncorrectError,
  nameRuRequiredError,
  nameEnRequiredError,
  thumbnailRequiredError,
  thumbnailUncorrectError,
  movieIdRequiredError,
  movieIdLenghtError,
  movieIdAlphanumError,
  movieIdUncorrectError,
} = require('../utils/messages');

movieRoutes.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required()
      .messages({
        'string.required': countryRequiredError,
      }),
    director: Joi.string().required()
      .messages({
        'string.required': directorRequiredError,
      }),
    duration: Joi.number().required()
      .messages({
        'number.required': durationRequiredError,
      }),
    year: Joi.string().required()
      .messages({
        'string.required': yearRequiredError,
      }),
    description: Joi.string().required()
      .messages({
        'string.required': descriptionRequiredError,
      }),
    image: Joi.string().pattern(regex).required()
      .messages({
        'string.required': imageRequiredError,
        'string.pattern': imageUncorrectError,
      }),
    trailer: Joi.string().pattern(regex).required()
      .messages({
        'string.required': trailerRequiredError,
        'string.pattern': trailerUncorrectError,
      }),
    nameRu: Joi.string().required()
      .messages({
        'string.required': nameRuRequiredError,
      }),
    nameEn: Joi.string().required()
      .messages({
        'string.required': nameEnRequiredError,
      }),
    thumbnail: Joi.string().pattern(regex).required()
      .messages({
        'string.required': thumbnailRequiredError,
        'string.pattern': thumbnailUncorrectError,
      }),
    movieId: Joi.string().required()
      .messages({
        'string.required': movieIdRequiredError,
      }),
  }),
}), createMovie);

movieRoutes.get('/movies', getMovies);

movieRoutes.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex()
      .messages({
        'string.length': movieIdLenghtError,
        'string.alphanum': movieIdAlphanumError,
        'string.hex': movieIdUncorrectError,
      }),
  }),
}), deleteMovieById);

module.exports = movieRoutes;
