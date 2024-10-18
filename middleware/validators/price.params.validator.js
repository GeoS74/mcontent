const fs = require('fs/promises');
const logger = require('../../libs/logger');

module.exports.priceIsNotNull = async (ctx, next) => {
  if (!ctx.request?.files) {
    ctx.throw(400, 'price not uploaded');
  }

  if (Object.keys(ctx.request.files).length > 1) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'more than one file received');
  }

  if (Object.keys(ctx.request.files).indexOf('price') === -1) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'field name "price" is empty');
  }

  if (Array.isArray(ctx.request.files.price)) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'more than 1 file received by field "price"');
  }

  if (!_checkMimeType(ctx.request.files.price.mimetype)) {
    _deleteFile(ctx.request.files);
    ctx.throw(400, 'bad price mime type');
  }

  await next();
};

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
  switch (mimeType) {
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/pdf':
    case 'application/vnd.rar':
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/zip':
      return true;
    default:
      return false;
  }
}
