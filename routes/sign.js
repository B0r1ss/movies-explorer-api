const { celebrate, Joi } = require('celebrate');
const signRouter = require('express').Router();
const { login, createUser } = require('../controllers/users');

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
    name: Joi.string().required().min(2).max(30),
  }),
});

signRouter.post('/signin', validateUserLogin, login);
signRouter.post('/signup', validateUserSignup, createUser);

module.exports = signRouter;
