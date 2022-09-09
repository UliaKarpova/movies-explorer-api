const movieRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regex = require('../utils/regex');

const {
  createMovie, getMovies, deleteMovieById,
} = require('../controllers/moviesController');

movieRoutes.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required()
      .messages({
        'string.required': 'Поле country обязательно для заполнения',
      }),
    director: Joi.string().required()
      .messages({
        'string.required': 'Поле director обязательно для заполнения',
      }),
    duration: Joi.number().required()
      .messages({
        'number.required': 'Поле duration обязательно для заполнения',
      }),
    year: Joi.string().required()
      .messages({
        'string.required': 'Поле year обязательно для заполнения',
      }),
    description: Joi.string().required()
      .messages({
        'string.required': 'Поле description обязательно для заполнения',
      }),
    image: Joi.string().pattern(regex).required()
      .messages({
        'string.required': 'Поле image обязательно для заполнения',
        'string.pattern': 'Поле image должно содержать ссылку',
      }),
    trailer: Joi.string().pattern(regex).required()
      .messages({
        'string.required': 'Поле trailer обязательно для заполнения',
        'string.pattern': 'Поле trailer должно содержать ссылку',
      }),
    nameRU: Joi.string().required()
      .messages({
        'string.required': 'Поле nameRU обязательно для заполнения',
      }),
    nameEN: Joi.string().required()
      .messages({
        'string.required': 'Поле nameEN обязательно для заполнения',
      }),
    thumbnail: Joi.string().pattern(regex).required()
      .messages({
        'string.required': 'Поле thumbnail обязательно для заполнения',
        'string.pattern': 'Поле thumbnail должно содержать ссылку',
      }),
    movieId: Joi.string().required()
      .messages({
        'string.required': 'Поле movieId обязательно',
      }),
  }),
}), createMovie);

movieRoutes.get('/movies', getMovies);

movieRoutes.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex()
      .messages({
        'string.length': 'Поле movieId должно содержать 24 символа',
        'string.alphanum': 'Поле movieId должно содержать буквы и числа',
        'string.hex': 'Ошибка в поле movieId',
      }),
  }),
}), deleteMovieById);

module.exports = movieRoutes;
