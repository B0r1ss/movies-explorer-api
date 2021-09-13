const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserMe,
  updateUser,
} = require('../controllers/users');

const validateUserId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
});

usersRouter.get('/me', validateUserId, getUserMe);
usersRouter.patch('/me', validateUserUpdate, updateUser);

module.exports = usersRouter;
