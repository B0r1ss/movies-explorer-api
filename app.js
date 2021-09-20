require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const cors = require('cors');

const { PORT = 3000, BD, NODE_ENV } = process.env;
const app = express();
const auth = require('./middlewares/auth');
const limiter = require('./middlewares/rateLimiter');
const signRouter = require('./routes/sign');
const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');
const errRouter = require('./routes/error');
const genErr = require('./middlewares/genErr');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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

app.use(requestLogger);

app.use(limiter);

app.use('/', signRouter);

app.use(auth);
app.use('/', moviesRouter);
app.use('/', usersRouter);
app.use('/', errRouter);

app.use(errorLogger);
app.use(errors());

app.use(genErr);

mongoose.connect(NODE_ENV === 'production'
  ? BD
  : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
