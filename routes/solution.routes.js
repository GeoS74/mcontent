const Router = require('koa-router');
const { koaBody } = require('koa-body');

const controller = require('../controllers/solution.controller');
// здесь используется валидатор progress, т.к. они идентичны
const validator = require('../middleware/validators/progress.params.validator');
const accessCheck = require('../middleware/access.check');
const emailCheck = require('../middleware/email.check');

const optional = {
  multipart: true,
};

/*
* роут без проверки access токена
*/
const publicRouter = new Router({ prefix: '/api/mcontent/solution/public' });

publicRouter.get(
  '/search',
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
const router = new Router({ prefix: '/api/mcontent/solution' });

router.use(accessCheck, emailCheck);

router.get(
  '/:id',
  validator.objectId,
  controller.get,
);

router.post(
  '/',
  koaBody(optional),
  validator.title,
  validator.message,
  validator.cssClass,
  validator.isPublic,
  controller.add,
);
router.patch(
  '/:id',
  koaBody(optional),
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
