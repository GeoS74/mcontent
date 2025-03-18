const Router = require('koa-router');

const { koaBody } = require('koa-body');
const accessCheck = require('../middleware/access.check');
const emailCheck = require('../middleware/email.check');
const validator = require('../middleware/validators/contact.params.validator');
const controller = require('../controllers/contact.controller');

/*
* роут без проверки access токена
*/
const publicRouter = new Router({ prefix: '/api/mcontent/contact/public' });

publicRouter.get('/', controller.getAll);

module.exports.publicRoutes = publicRouter.routes();

/*
* все роуты доступны только при наличии access токена
* CRUD операции выполняются по email-у, передаваемом в access токене
* если проверка access токена выключена, срабатывает валидатор email
*/

const router = new Router({ prefix: '/api/mcontent/contact' });

router.use(accessCheck, emailCheck);

router.get(
  '/:alias',
  validator.alias,
  controller.get,
);

router.patch(
  '/:alias',
  koaBody({ multipart: true }),
  validator.alias,
  validator.value,
  controller.update,
);

module.exports.routes = router.routes();
