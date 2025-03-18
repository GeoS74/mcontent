const Router = require('koa-router');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const mount = require('koa-mount');

const { dirInit } = require('../libs/common');
const controller = require('../controllers/catalog.position.controller');
const validator = require('../middleware/validators/catalog.position.params.validator');
const accessCheck = require('../middleware/access.check');
const emailCheck = require('../middleware/email.check');
const config = require('../config');

dirInit('./files/catalog/position/images');
dirInit('./files/catalog/position/pdf');

/*
* роут без проверки access токена
*/
const publicRouter = new Router({ prefix: '/api/mcontent/catalog/position/public' });

publicRouter.get(
  '/',
  validator.searchString,
  validator.lastId,
  validator.limit,
  validator.filterLevel,
  validator.isPublic,

  controller.search,
);

module.exports.publicRoutes = publicRouter.routes();

/*
* все роуты доступны только при наличии access токена
* CRUD операции выполняются по email-у, передаваемом в access токене
* если проверка access токена выключена, срабатывает валидатор email
*/
const router = new Router({ prefix: '/api/mcontent/catalog/position' });

// router.use(accessCheck, emailCheck);

router.get(
  '/:id',
  validator.objectId,
  controller.get,
);
router.post(
  '/',
  koaBody(config.koaBodyOptional),
  validator.pdf,
  validator.image,
  validator.level,
  validator.title,
  validator.article,
  validator.description,
  validator.isPublic,
  controller.add,
);
router.patch(
  '/:id',
  koaBody(config.koaBodyOptional),
  validator.objectId,
  validator.level,
  validator.pdf,
  validator.image,
  validator.title,
  validator.article,
  validator.description,
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
module.exports.static = mount('/api/mcontent/static/catalog/position/images', serve('./files/catalog/position/images'));
module.exports.static = mount('/api/mcontent/static/catalog/position/pdf', serve('./files/catalog/position/pdf'));
