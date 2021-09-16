const BadReqErr = require('../errors/badReqErr');
const NotFoundErr = require('../errors/notFoundErr');
const ForbErr = require('../errors/forbErr');

const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  } = req.body;

  Movie.create(
    {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    },
  ).then((newMovie) => {
    if (!newMovie) {
      throw new NotFoundErr('Запрашиваемый ресурс не найден');
    } else {
      res.send(newMovie);
    }
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqErr('Ошибка валидации. Введены некорректные данные'));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._movieId)
    .select('+owner').then((movie) => {
      if (movie === null) {
        throw new NotFoundErr('Запрашиваемый ресурс не найден');
      }
      if (!movie.owner.equals(req.user._movieId)) {
        throw new ForbErr('Ошибка удаления чужого фильма');
      }
    }).then(() => {
      Movie.findByIdAndRemove(req.params._movieId)
        .then((movie) => {
          if (movie === null) {
            throw new NotFoundErr('Запрашиваемый ресурс не найден');
          } else {
            res.send(movie);
          }
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadReqErr('Ошибка валидации. Введены некорректные данные'));
          }
          next(err);
        });
    })
    .catch(next);
};
