const { isValidObjectId } = require('mongoose');
const CatalogLevel = require('../../models/CatalogLevel');

module.exports.title = async (ctx, next) => {
  const title = _checkText(ctx.request?.body?.title);

  if (!title) {
    ctx.throw(400, 'title is empty');
  }

  ctx.request.body.title = title;

  await next();
};

module.exports.parent = async (ctx, next) => {
  if (ctx.request.body.parent) {
    if (!isValidObjectId(ctx.request.body.parent)) {
      ctx.throw(400, 'invalid parent id of catalog level');
    }

    // не может быть подчинён сам себе
    if (ctx.params.id && ctx.params.id === ctx.request.body.parent) {
      ctx.throw(400, 'cannot be subordinated to oneself');
    }

    const parent = await _checkLevelById(ctx.request.body.parent);
    if (!parent) {
      ctx.throw(400, 'parent not exists');
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
