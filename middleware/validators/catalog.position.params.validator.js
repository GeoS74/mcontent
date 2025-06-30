const { isValidObjectId } = require('mongoose');
const CatalogLevel = require('../../models/CatalogLevel');
const { isImage, isPDF } = require('../../libs/checkMimeType');

module.exports.pdf = async (ctx, next) => {
  if (!ctx.request?.files?.pdf) {
    ctx.request.body.pdf = undefined;
    await next();
    return;
  }

  if (Array.isArray(ctx.request.files.pdf)) {
    ctx.throw(400, 'more than one file received by field "pdf"');
  }

  if (!isPDF(ctx.request.files.pdf.mimetype)) {
    ctx.throw(400, 'bad pdf mime type');
  }

  ctx.request.body.pdf = ctx.request.files.pdf;

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

module.exports.filterLevel = async (ctx, next) => {
  if (ctx.query.level) {
    if (!isValidObjectId(ctx.query.level)) {
      ctx.throw(400, 'invalid level id');
    }
  }

  await next();
};

module.exports.filterAlias = async (ctx, next) => {
  ctx.query.alias = ctx.query.alias || '';
  await next();
};

module.exports.filterLevelAlias = async (ctx, next) => {
  ctx.query.levelAlias = ctx.query.levelAlias || '';
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
  if (ctx.query.limit > defaultLimit) {
    ctx.query.limit = defaultLimit;
  }

  await next();
};

module.exports.offset = async (ctx, next) => {
  const defaultOffset = 0;

  ctx.query.offset = parseInt(ctx.query.offset, 10) || defaultOffset;

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
  ctx.request.body.title = ctx.request.body?.title?.trim();

  if (!ctx.request.body.title) {
    ctx.throw(400, 'title is empty');
  }

  await next();
};

module.exports.article = async (ctx, next) => {
  ctx.request.body.article = ctx.request.body?.article?.trim() || '';
  await next();
};

module.exports.objectId = async (ctx, next) => {
  if (!isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid slide id');
  }

  await next();
};

module.exports.level = async (ctx, next) => {
  if (!isValidObjectId(ctx.request.body.level)) {
    ctx.throw(400, 'invalid level id of catalog position');
  }

  const level = await _checkLevelById(ctx.request.body.level);
  if (!level) {
    ctx.throw(400, 'level not exists');
  }

  await next();
};

module.exports.description = async (ctx, next) => {
  ctx.request.body.description = ctx.request.body?.description?.trim() || '';
  await next();
};

function _checkLevelById(id) {
  return CatalogLevel.findById(id);
}
