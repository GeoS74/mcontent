const { isValidObjectId } = require('mongoose');
const { isImage } = require('../../libs/checkMimeType');

module.exports.imageIsNotNull = async (ctx, next) => {
  if (!ctx.request?.files?.image) {
    ctx.throw(400, 'image not uploaded');
  }

  await next();
};

module.exports.image = async (ctx, next) => {
  if (!ctx.request?.files?.image) {
    ctx.request.body.image = undefined;
    await next();
    return;
  }

  if (Array.isArray(ctx.request.files.image)) {
    ctx.throw(400, 'more than one file received by field "image"');
  }

  if (!isImage(ctx.request.files.image.mimetype)) {
    ctx.throw(400, 'bad image mime type');
  }

  ctx.request.body.image = ctx.request.files.image;

  await next();
};

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
  const defaultLimit = 25;

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
  ctx.request.body.title = ctx.request.body?.title?.trim() || '';
  await next();
};

module.exports.message = async (ctx, next) => {
  ctx.request.body.message = ctx.request.body?.message?.trim() || '';
  await next();
};

module.exports.objectId = async (ctx, next) => {
  if (!isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid note id');
  }

  await next();
};
