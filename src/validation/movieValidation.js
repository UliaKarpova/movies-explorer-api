const { celebrate, Joi } = require('celebrate');
const regex = require('../utils/regex');

const {
  countryRequiredError,
  directorRequiredError,
  durationRequiredError,
  durationTypeError,
  yearRequiredError,
  descriptionRequiredError,
  imageRequiredError,
  imageUncorrectedError,
  trailerRequiredError,
  trailerUncorrectedError,
  nameRuRequiredError,
  nameEnRequiredError,
  thumbnailRequiredError,
  thumbnailUncorrectedError,
  movieIdRequiredError,
  movieIdTypeError,
  movieIdLenghtError,
  movieIdHexError,
} = require('../utils/messages');

module.exports.createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required()
      .messages({
        'any.required': countryRequiredError,
      }),
    director: Joi.string().required()
      .messages({
        'any.required': directorRequiredError,
      }),
    duration: Joi.number().required()
      .messages({
        'number.base': durationTypeError,
        'any.required': durationRequiredError,
      }),
    year: Joi.string().required()
      .messages({
        'any.required': yearRequiredError,
      }),
    description: Joi.string().required()
      .messages({
        'any.required': descriptionRequiredError,
      }),
    image: Joi.string().pattern(regex).required()
      .messages({
        'any.required': imageRequiredError,
        'string.pattern.base': imageUncorrectedError,
      }),
    trailer: Joi.string().pattern(regex).required()
      .messages({
        'string.pattern.base': trailerUncorrectedError,
        'any.required': trailerRequiredError,
      }),
    nameRu: Joi.string().required()
      .messages({
        'any.required': nameRuRequiredError,
      }),
    nameEn: Joi.string().required()
      .messages({
        'any.required': nameEnRequiredError,
      }),
    thumbnail: Joi.string().pattern(regex).required()
      .messages({
        'any.required': thumbnailRequiredError,
        'string.pattern.base': thumbnailUncorrectedError,
      }),
    movieId: Joi.number().required()
      .messages({
        'number.base': movieIdTypeError,
        'any.required': movieIdRequiredError,
      }),
  }),
});

module.exports.deleteMovieValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required()
      .messages({
        'any.required': movieIdRequiredError,
        'string.length': movieIdLenghtError,
        'string.hex': movieIdHexError,
      }),
  }),
});
