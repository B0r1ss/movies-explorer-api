const errRouter = require('express').Router();
const NotFoundError = require('../errors/notFoundErr');

errRouter.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = errRouter;
