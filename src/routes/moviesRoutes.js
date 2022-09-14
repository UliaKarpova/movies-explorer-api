const movieRoutes = require('express').Router();
const { createMovieValidation, deleteMovieValidation } = require('../validation/movieValidation');

const {
  createMovie, getMovies, deleteMovieById,
} = require('../controllers/moviesController');

movieRoutes.post('/movies', createMovieValidation, createMovie);

movieRoutes.get('/movies', getMovies);

movieRoutes.delete('/movies/:movieId', deleteMovieValidation, deleteMovieById);

module.exports = movieRoutes;
