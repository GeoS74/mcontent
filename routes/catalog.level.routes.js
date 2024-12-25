const { readdir, mkdir } = require('node:fs/promises');
const Router = require('koa-router');
const { koaBody } = require('koa-body');

const controller = require('../controllers/catalog.level.controller');
const validator = require('../middleware/validators/catalog.level.params.validator');
const accessCheck = require('../middleware/access.check');
const emailCheck = require('../middleware/email.check');

(async () => {
  try {
    await readdir('./files/images/catalog');
  } catch (error) {
    mkdir('./files/images/catalog', {
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
const publicRouter = new Router({ prefix: '/api/mcontent/catalog/level/public' });

publicRouter.get(
  '/',
  controller.getAll,
);

module.exports.publicRoutes = publicRouter.routes();

/*
* все роуты доступны только при наличии access токена
* CRUD операции выполняются по email-у, передаваемом в access токене
* если проверка access токена выключена, срабатывает валидатор email
*/
const router = new Router({ prefix: '/api/mcontent/catalog/level' });

router.use(accessCheck, emailCheck);

router.get(
  '/:id',
  validator.objectId,
  controller.get,
);

router.post(
  '/',
  koaBody(optional),
  validator.imageIsNotNull,
  validator.title,
  validator.parent,
  controller.add,
);

router.patch(
  '/:id',
  koaBody(optional),
  validator.objectId,
  validator.image,
  validator.title,
  validator.parent,
  controller.update,
);

router.delete(
  '/:id',
  validator.objectId,
  controller.delete,
);

module.exports.routes = router.routes();
