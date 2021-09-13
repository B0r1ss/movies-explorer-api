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
    _id: Joi.string().alphanum().length(24).hex(),
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
    owner: Joi.required(),
    movieId: Joi.required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

moviesRouter.get('/', getMovies);
moviesRouter.post('/', validateMovie, createMovie);
moviesRouter.delete('/:_movieId', validateMovieId, deleteMovie);

module.exports = moviesRouter;
