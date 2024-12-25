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

    try {
      await _checkParent(ctx.params.id, ctx.request.body.parent);
    } catch (e) {
      ctx.throw(400, e.message);
    }
  }

  await next();
};

module.exports.objectId = async (ctx, next) => {
  if (!ctx.params.id || !isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid catalog level id');
  }

  await next();
};

/*
функция рекурсивно поднимается по дереву вверх используя id родителя
выбросит ошибку если:
1) родителя по id не существует
2) попытка подчинить раздел самому себе
3) попытка подчинить раздел своему потомку
*/
async function _checkParent(id, parentId) {
  const parent = await CatalogLevel.findById(parentId);

  if (!parent) {
    throw new Error('parent not exists');
  }

  if (parent.id === id) {
    throw new Error('cannot be subordinated to oneself or nested level');
  }

  if (parent.parent) {
    await _checkParent(id, parent.parent);
  }
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
