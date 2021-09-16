/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const cors = require('cors');

const { PORT = 3000, BDPORT, NODE_ENV } = process.env;
const app = express();
const auth = require('./middlewares/auth');
const limiter = require('./middlewares/rateLimiter');
const signRouter = require('./routes/sign');
const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundErr = require('./errors/notFoundErr');

const options = {
  origin: [
    `http://localhost:${PORT}`,
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

app.use(limiter);

app.use(requestLogger);

app.use('/', signRouter);
app.use(auth);
app.use('/', moviesRouter);
app.use('/', usersRouter);

app.use(errorLogger);

app.use('/', (req, res) => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден');
});

app.use((err, req, res, next) => {
  const { statusCode = 409, message } = err;
  res.status(statusCode).send({
    message: statusCode === 409 ? 'Ошибка запроса' : message,
  });
});

app.use(errors());

mongoose.connect(NODE_ENV === 'production'
  ? `mongodb://localhost:${BDPORT}/moviesdb`
  : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
