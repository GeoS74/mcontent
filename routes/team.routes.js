const { readdir, mkdir } = require('node:fs/promises');
const Router = require('koa-router');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const mount = require('koa-mount');

const controller = require('../controllers/team.controller');
const validator = require('../middleware/validators/team.params.validator');
const accessCheck = require('../middleware/access.check');
const emailCheck = require('../middleware/email.check');

(async () => {
  try {
    await readdir('./files/images/team');
  } catch (error) {
    mkdir('./files/images/team', {
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
const publicRouter = new Router({ prefix: '/api/mcontent/team/public' });

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
const router = new Router({ prefix: '/api/mcontent/team' });

router.use(accessCheck, emailCheck);

router.get(
  '/:id',
  validator.objectId,
  controller.get,
);

router.post(
  '/',
  koaBody(optional),
  validator.photoIsNotNull,
  validator.name,
  validator.position,
  validator.isPublic,
  controller.add,
);
router.patch(
  '/:id',
  koaBody(optional),
  validator.objectId,
  validator.photo,
  validator.name,
  validator.position,
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
module.exports.static = mount('/api/mcontent/static/images/team', serve('./files/images/team'));