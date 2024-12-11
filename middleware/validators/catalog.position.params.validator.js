const fs = require('fs/promises');
const { isValidObjectId } = require('mongoose');
const CatalogLevel = require('../../models/CatalogLevel');
const logger = require('../../libs/logger');

module.exports.imageIsNotNull = async (ctx, next) => {
  if (!ctx.request?.files) {
    ctx.throw(400, 'image not uploaded');
  }

  if (Object.keys(ctx.request.files).length > 1) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'more than one file received');
  }

  if (Object.keys(ctx.request.files).indexOf('image') === -1) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'field name "image" is empty');
  }

  if (Array.isArray(ctx.request.files.image)) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'more than 1 file received by field "image"');
  }

  if (!_checkMimeType(ctx.request.files.image.mimetype)) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'bad image mime type');
  }

  await next();
};

module.exports.image = async (ctx, next) => {
  if (!ctx.request?.files) {
    ctx.request.files = undefined;
    await next();
    return;
  }

  if (Object.keys(ctx.request.files).length > 1) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'more than one file received');
  }

  if (Object.keys(ctx.request.files).indexOf('image') === -1) {
    _deleteFile(ctx.request.files);
    ctx.request.files = undefined;
    await next();
    return;
  }

  if (Array.isArray(ctx.request.files.image)) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'more than 1 file received by field "image"');
  }

  if (!_checkMimeType(ctx.request.files.image.mimetype)) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'bad image mime type');
  }

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
  const title = _checkText(ctx.request?.body?.title);

  if (!title) {
    _deleteFile(ctx.request.files || []);
    ctx.throw(400, 'title is empty');
  }

  ctx.request.body.title = title;

  await next();
};

module.exports.article = async (ctx, next) => {
  ctx.request.body.article = _checkText(ctx.request?.body?.article) || '';
  await next();
};

module.exports.objectId = async (ctx, next) => {
  if (!isValidObjectId(ctx.params.id)) {
    _deleteFile(ctx.request.files || []);
    ctx.throw(400, 'invalid slide id');
  }

  await next();
};

module.exports.level = async (ctx, next) => {
  if (!isValidObjectId(ctx.request.body.level)) {
    _deleteFile(ctx.request.files || []);
    ctx.throw(400, 'invalid level id of catalog position');
  }

  const level = await _checkLevelById(ctx.request.body.level);
  if (!level) {
    _deleteFile(ctx.request.files || []);
    ctx.throw(400, 'level not exists');
  }

  await next();
};

function _checkLevelById(id) {
  return CatalogLevel.findById(id);
}

function _checkText(text) {
  return text?.trim();
}

function _deleteFile(files) {
  for (const file of Object.values(files)) {
    // received more than 1 file in any field with the same name
    if (Array.isArray(file)) {
      _deleteFile(file);
    } else {
      fs.unlink(file.filepath)
        .catch((error) => logger.error(error.mesasge));
    }
  }
}

function _checkMimeType(mimeType) {
  if (/^image\/\w+/.test(mimeType)) {
    return true;
  }
  return false;
}
