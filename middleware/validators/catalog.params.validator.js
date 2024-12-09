const { isValidObjectId } = require('mongoose');
const CatalogLevel = require('../../models/CatalogLevel');

module.exports.title = async (ctx, next) => {
  ctx.request.body.title = _checkText(ctx.request?.body?.title) || undefined;

  await next();
};

module.exports.parent = async (ctx, next) => {
  if (ctx.request.body.parent) {
    if (!isValidObjectId(ctx.request.body.parent)) {
      ctx.throw(400, 'invalid parent id of catalog level');
    }

    const parent = await _checkLevelById(ctx.request.body.parent);
    if (!parent) {
      ctx.throw(400, 'parent nor exists');
    }
  }

  await next();
};

module.exports.objectId = async (ctx, next) => {
  if (!isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid catalog level id');
  }

  await next();
};

function _checkLevelById(id) {
  return CatalogLevel.findById(id);
}

function _checkText(text) {
  return text?.trim();
}
