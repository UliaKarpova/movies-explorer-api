const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
description: {
    type: String,
    required: true,
},
image: {
  type: String,
  required: true,
  validate: {
    validator(v) {
      return validator.isURL(v);
    },
    message: 'Ссылка указана неверно',
  },
},
trailer: {
  type: String,
  required: true,
  validate: {
    validator(v) {
      return validator.isURL(v);
    },
    message: 'Ссылка указана неверно',
  },
},
thumbnail: {
  type: String,
  required: true,
  validate: {
    validator(v) {
      return validator.isURL(v);
    },
    message: 'Ссылка указана неверно',
  },
},
owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user',
  required: true,
},
movieId: {
  type: String,
  required: true,
},
nameRu: {
  type: String,
  required: true,
},
nameEn: {
  type: String,
  required: true,
}
});

module.exports = mongoose.model('movie', movieSchema);

/*
movieId — id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле. */