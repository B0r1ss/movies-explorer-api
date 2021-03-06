const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadReqErr = require('../errors/badReqErr');
const NotFoundErr = require('../errors/notFoundErr');
const UniqueError = require('../errors/uniqErr');

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь с таким id не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email, password: hash, name,
    })
      .then((newUser) => {
        if (!newUser) {
          throw new NotFoundErr('Ошибка создания пользователя');
        } else {
          res.status(200).send({
            name: newUser.name,
            email: newUser.email,
            _id: newUser._id,
          });
        }
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadReqErr('Ошибка валидации. Введены некорректные данные'));
        } else if (err.code === 11000) {
          next(new UniqueError('Данный email уже зарегистрирован'));
        }
        next(err);
      });
  });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id, { email, name }, { new: true, runValidators: true, upsert: false },
  ).then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqErr('Ошибка валидации. Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Запрашиваемый ресурс не найден');
      } else {
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        );
        res
          .status(200)
          .send({ token });
      }
    })
    .catch((err) => {
      next(err);
    });
};
