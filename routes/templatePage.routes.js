const Router = require('koa-router');

const { koaBody } = require('koa-body');
const accessCheck = require('../middleware/access.check');
const emailCheck = require('../middleware/email.check');
const validator = require('../middleware/validators/templatepages.params.validator');
const controller = require('../controllers/templatePage.controller');

/*
* роут без проверки access токена
*/
const publicRouter = new Router({ prefix: '/api/mcontent/template/public' });

publicRouter.get(
  '/:alias',
  validator.alias,
  controller.get,
);

module.exports.publicRoutes = publicRouter.routes();

/*
* все роуты доступны только при наличии access токена
* CRUD операции выполняются по email-у, передаваемом в access токене
* если проверка access токена выключена, срабатывает валидатор email
*/

const router = new Router({ prefix: '/api/mcontent/template/pages' });

router.use(accessCheck, emailCheck);

router.get('/', controller.getAll);

router.patch(
  '/:alias',
  koaBody(),
  validator.alias,
  validator.title,
  validator.description,
  controller.update,
);

module.exports.routes = router.routes();
