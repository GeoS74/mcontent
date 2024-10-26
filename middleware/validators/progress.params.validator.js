const { isValidObjectId } = require('mongoose');

module.exports.searchString = async (ctx, next) => {
  ctx.query.search = ctx.query.search || '';

  await next();
};

module.exports.lastId = async (ctx, next) => {
  if (ctx.query.last) {
    if (!isValidObjectId(ctx.query.last)) {
      ctx.throw(400, 'invalid last id');
    }
  }

  ctx.query.lastId = ctx.query.last;

  await next();
};

module.exports.limit = async (ctx, next) => {
  const defaultLimit = 4;

  ctx.query.limit = parseInt(ctx.query.limit, 10) || defaultLimit;
  if (ctx.query.limit > 25) {
    ctx.query.limit = defaultLimit;
  }

  await next();
};

// этот флаг может передаваться в url и в теле запроса
// используем один валидатор
module.exports.isPublic = async (ctx, next) => {
  ctx.query.isPublic = !!ctx.query.isPublic;

  if (ctx.request.body) {
    ctx.request.body.isPublic = !!ctx.request.body.isPublic;
  }
  await next();
};

module.exports.title = async (ctx, next) => {
  const title = _checkText(ctx.request?.body?.title) || '';

  if (!title) {
    ctx.throw(400, 'title is empty');
  }

  await next();
};

module.exports.message = async (ctx, next) => {
  ctx.request.body.message = _checkText(ctx.request?.body?.message) || '';
  await next();
};

module.exports.cssClass = async (ctx, next) => {
  ctx.request.body.cssClass = _checkText(ctx.request?.body?.cssClass) || '';
  await next();
};

module.exports.objectId = async (ctx, next) => {
  if (!isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid slide id');
  }

  await next();
};

function _checkText(text) {
  return text?.trim();
}
