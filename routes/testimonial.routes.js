const Router = require('koa-router');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const mount = require('koa-mount');

const { dirInit } = require('../libs/common');
const controller = require('../controllers/testimonial.controller');
const validator = require('../middleware/validators/testimonial.params.validator');
const accessCheck = require('../middleware/access.check');
const emailCheck = require('../middleware/email.check');
const config = require('../config');

dirInit('./files/images/testimonial');

/*
* роут без проверки access токена
*/
const publicRouter = new Router({ prefix: '/api/mcontent/testimonial/public' });

publicRouter.get(
  '/',
  validator.searchString,
  validator.lastId,
  validator.limit,
  validator.isPublic,

  controller.getAll,
);

module.exports.publicRoutes = publicRouter.routes();

/*
* все роуты доступны только при наличии access токена
* CRUD операции выполняются по email-у, передаваемом в access токене
* если проверка access токена выключена, срабатывает валидатор email
*/
const router = new Router({ prefix: '/api/mcontent/testimonial' });

router.use(accessCheck, emailCheck);

router.get(
  '/:id',
  validator.objectId,
  controller.get,
);

router.post(
  '/',
  koaBody(config.koaBodyOptional),
  validator.photoIsNotNull,
  validator.name,
  validator.message,
  validator.company,
  validator.isPublic,
  controller.add,
);
router.patch(
  '/:id',
  koaBody(config.koaBodyOptional),
  validator.objectId,
  validator.photo,
  validator.name,
  validator.message,
  validator.company,
  validator.isPublic,
  controller.update,
);
router.delete(
  '/:id',
  validator.objectId,
  controller.delete,
);

module.exports.routes = router.routes();

// static files
module.exports.static = mount('/api/mcontent/static/images/testimonial', serve('./files/images/testimonial'));
