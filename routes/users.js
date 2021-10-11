const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserMe,
  updateUser,
} = require('../controllers/users');

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

usersRouter.get('/users/me', getUserMe);
usersRouter.patch('/users/me', validateUserUpdate, updateUser);

module.exports = usersRouter;
