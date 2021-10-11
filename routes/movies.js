const moviesRouter = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const validateMovieId = celebrate({
  params: Joi.object().keys({
    _movieId: Joi.string().required().length(24).hex(),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string()
      .required()
      .custom((url) => {
        if (!validator.isURL(url)) {
          throw new CelebrateError('Неверная ссылка');
        }
        return url;
      }),
    trailer: Joi.string()
      .required()
      .custom((url) => {
        if (!validator.isURL(url)) {
          throw new CelebrateError('Неверная ссылка');
        }
        return url;
      }),
    thumbnail: Joi.string()
      .required()
      .custom((url) => {
        if (!validator.isURL(url)) {
          throw new CelebrateError('Неверная ссылка');
        }
        return url;
      }),
    movieId: Joi.required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', validateMovie, createMovie);
moviesRouter.delete('/movies/:_movieId', validateMovieId, deleteMovie);

module.exports = moviesRouter;
