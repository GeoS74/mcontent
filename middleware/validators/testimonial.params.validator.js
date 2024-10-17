const fs = require('fs/promises');
const { isValidObjectId } = require('mongoose');
const logger = require('../../libs/logger');

module.exports.photoIsNotNull = async (ctx, next) => {
  if (!ctx.request?.files) {
    ctx.throw(400, 'photo not uploaded');
  }

  if (Object.keys(ctx.request.files).length > 1) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'more than one file received');
  }

  if (Object.keys(ctx.request.files).indexOf('photo') === -1) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'field name "photo" is empty');
  }

  if (Array.isArray(ctx.request.files.photo)) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'more than 1 file received by field "photo"');
  }

  if (!_checkMimeType(ctx.request.files.photo.mimetype)) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'bad photo mime type');
  }

  await next();
};

module.exports.photo = async (ctx, next) => {
  if (!ctx.request?.files) {
    ctx.request.files = undefined;
    await next();
    return;
  }

  if (Object.keys(ctx.request.files).length > 1) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'more than one file received');
  }

  if (Object.keys(ctx.request.files).indexOf('photo') === -1) {
    _deleteFile(ctx.request.files);
    ctx.request.files = undefined;
    await next();
    return;
  }

  if (Array.isArray(ctx.request.files.photo)) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'more than 1 file received by field "photo"');
  }

  if (!_checkMimeType(ctx.request.files.photo.mimetype)) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'bad photo mime type');
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
  const defaultLimit = 5;

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

module.exports.name = async (ctx, next) => {
  const name = _checkText(ctx.request?.body?.name);

  if (!name) {
    ctx.throw(400, 'name is required');
  }

  ctx.request.body.name = name;
  await next();
};

module.exports.message = async (ctx, next) => {
  const message = _checkText(ctx.request?.body?.message);

  if (!message) {
    ctx.throw(400, 'message is required');
  }

  ctx.request.body.message = message;
  await next();
};

module.exports.company = async (ctx, next) => {
  ctx.request.body.company = _checkText(ctx.request?.body?.company) || '';
  await next();
};

module.exports.objectId = async (ctx, next) => {
  if (!isValidObjectId(ctx.params.id)) {
    _deleteFile(ctx.request.files || []);
    ctx.throw(400, 'invalid testimonial id');
  }

  await next();
};

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
