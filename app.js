/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const {
  errors, celebrate, Joi, CelebrateError,
} = require('celebrate');
const validator = require('validator');

const cors = require('cors');

const { PORT = 3000 } = process.env;
const app = express();
const auth = require('./middlewares/auth');
const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundErr = require('./errors/notFoundErr');

// Validation JOY
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const options = {
  origin: [
    'http://localhost:3000',
    'https://mesto.borbackend.nomoredomains.monster',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Accept'],
  credentials: true,
};
app.use('*', cors(options));

app.use(express.json());
app.use(helmet());

app.use(requestLogger);

app.use('/signin', validateUserLogin, login);
app.post('/signup', validateUserSignup, createUser);
app.use(auth);
app.use('/movies', moviesRouter);
app.use('/users', usersRouter);

app.use(errorLogger);

app.use('/', (req, res) => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден');
});

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
