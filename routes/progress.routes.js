const Router = require('koa-router');
const { koaBody } = require('koa-body');

const controller = require('../controllers/progress.controller');
const validator = require('../middleware/validators/progress.params.validator');
const accessCheck = require('../middleware/access.check');
const emailCheck = require('../middleware/email.check');
const bodyNotBeEmpty = require('../middleware/bodyNotBeEmpty');

/*
* роут без проверки access токена
*/
const publicRouter = new Router({ prefix: '/api/mcontent/progress/public' });

publicRouter.get(
  '/',
  validator.searchString,
  validator.lastId,
  validator.limit,
  validator.isPublic,

  controller.search,
);

module.exports.publicRoutes = publicRouter.routes();

/*
* все роуты доступны только при наличии access токена
* CRUD операции выполняются по email-у, передаваемом в access токене
* если проверка access токена выключена, срабатывает валидатор email
*/
const router = new Router({ prefix: '/api/mcontent/progress' });

router.use(accessCheck, emailCheck);

router.get(
  '/:id',
  validator.objectId,
  controller.get,
);

router.post(
  '/',
  koaBody({multipart: true}),
  bodyNotBeEmpty,
  validator.title,
  validator.message,
  validator.cssClass,
  validator.isPublic,
  controller.add,
);
router.patch(
  '/:id',
  koaBody({multipart: true}),
  bodyNotBeEmpty,
  validator.objectId,
  validator.title,
  validator.message,
  validator.cssClass,
  validator.isPublic,
  controller.update,
);
router.delete(
  '/:id',
  validator.objectId,
  controller.delete,
);

module.exports.routes = router.routes();
