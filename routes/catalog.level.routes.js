const Router = require('koa-router');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const mount = require('koa-mount');

const { dirInit } = require('../libs/common');
const controller = require('../controllers/catalog.level.controller');
const validator = require('../middleware/validators/catalog.level.params.validator');
const accessCheck = require('../middleware/access.check');
const emailCheck = require('../middleware/email.check');
const config = require('../config');
const bodyNotBeEmpty = require('../middleware/bodyNotBeEmpty');

dirInit('./files/catalog/level/images');

/*
* роут без проверки access токена
*/
const publicRouter = new Router({ prefix: '/api/mcontent/catalog/level/public' });

publicRouter.get(
  '/',
  controller.getAll,
);

publicRouter.get(
  '/:id',
  validator.objectId,
  controller.get,
);

module.exports.publicRoutes = publicRouter.routes();

/*
* все роуты доступны только при наличии access токена
* CRUD операции выполняются по email-у, передаваемом в access токене
* если проверка access токена выключена, срабатывает валидатор email
*/
const router = new Router({ prefix: '/api/mcontent/catalog/level' });

router.use(accessCheck, emailCheck);

router.post(
  '/',
  koaBody(config.koaBodyOptional),
  bodyNotBeEmpty,
  validator.image,
  validator.title,
  validator.description,
  validator.parent,
  controller.add,
);

router.patch(
  '/:id',
  koaBody(config.koaBodyOptional),
  bodyNotBeEmpty,
  validator.objectId,
  validator.image,
  validator.title,
  validator.description,
  validator.parent,
  controller.update,
);

router.delete(
  '/:id',
  validator.objectId,
  controller.delete,
);

module.exports.routes = router.routes();

// static files
module.exports.static = mount('/api/mcontent/static/catalog/level/images', serve('./files/catalog/level/images'));
