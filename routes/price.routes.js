const { readdir, mkdir } = require('node:fs/promises');
const Router = require('koa-router');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const mount = require('koa-mount');

const controller = require('../controllers/price.controller');
const validator = require('../middleware/validators/price.params.validator');
const accessCheck = require('../middleware/access.check');
const emailCheck = require('../middleware/email.check');
const bodyNotBeEmpty = require('../middleware/bodyNotBeEmpty');

(async () => {
  try {
    await readdir('./files/price');
  } catch (error) {
    mkdir('./files/price', {
      recursive: true,
    });
  }
})();

const optional = {
  formidable: {
    uploadDir: './files',
    allowEmptyFiles: false,
    minFileSize: 1,
    multiples: true,
    hashAlgorithm: 'md5',
    keepExtensions: true,
  },
  multipart: true,
};

/*
* роут без проверки access токена
*/
const publicRouter = new Router({ prefix: '/api/mcontent/price/public' });

publicRouter.get('/', controller.get);

module.exports.publicRoutes = publicRouter.routes();

/*
* все роуты доступны только при наличии access токена
* CRUD операции выполняются по email-у, передаваемом в access токене
* если проверка access токена выключена, срабатывает валидатор email
*/
const router = new Router({ prefix: '/api/mcontent/price' });

router.use(accessCheck, emailCheck);

router.post(
  '/',
  koaBody(optional),
  bodyNotBeEmpty,
  validator.priceIsNotNull,
  controller.add,
);

router.delete('/', controller.delete);

module.exports.routes = router.routes();

// static files
module.exports.static = mount('/api/mcontent/static/price', serve('./files/price'));
