const Router = require('koa-router');

const accessCheck = require('../middleware/access.check');
const controller = require('../controllers/templatePage.controller');

const router = new Router({ prefix: '/api/mcontent/template/pages' });

router.get('/', accessCheck, controller.get);

module.exports = router.routes();
