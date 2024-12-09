const Router = require('koa-router');
const { koaBody } = require('koa-body');

const controller = require('../controllers/catalog.controller');
const validator = require('../middleware/validators/catalog.params.validator');
const accessCheck = require('../middleware/access.check');
const emailCheck = require('../middleware/email.check');

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
* все роуты доступны только при наличии access токена
* CRUD операции выполняются по email-у, передаваемом в access токене
* если проверка access токена выключена, срабатывает валидатор email
*/
const router = new Router({ prefix: '/api/mcontent/catalog' });

// router.use(accessCheck, emailCheck);

router.get(
  '/',
  controller.getAll,
);

router.get(
  '/:id',
  validator.objectId,
  controller.get,
);

router.post(
  '/',
  koaBody(optional),
  validator.title,
  validator.parent,
  controller.add,
);

router.patch(
  '/:id',
  koaBody(optional),
  validator.objectId,
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
