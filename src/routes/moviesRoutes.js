const movieRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regex = require('../utils/regex');

const {
  createMovie, getMovies, deleteMovieById,
} = require('../controllers/moviesController');

movieRoutes.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(regex).required(),
    trailer: Joi.string().pattern(regex).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(regex).required(),
    movieId: Joi.string().required(),
    owner:Joi.string().required(),
  }),
}), createMovie);

movieRoutes.get('/movies', getMovies);

movieRoutes.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex(),
  }),
}), deleteMovieById);

/* movieRoutes.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
}), likeCard);

movieRoutes.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
}), dislikeCard); */

module.exports = movieRoutes;
