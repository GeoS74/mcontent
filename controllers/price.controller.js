const fs = require('fs/promises');
const path = require('path');
const Price = require('../models/Price');
const mapper = require('../mappers/price.mapper');
const logger = require('../libs/logger');

module.exports.get = async (ctx) => {
  const price = await _getPrice();

  if (!price) {
    ctx.throw(404, 'price not found');
  }
  ctx.status = 200;
  ctx.body = mapper(price);
};

module.exports.add = async (ctx) => {
  // функция this.delete может выбрасывать ошибку 404
  try {
    await this.delete(ctx);
  } catch (e) { /** ... */ }

  const { fileName } = await _processingFile(ctx.request.files.price);
  const price = await _addPrice(fileName);

  ctx.status = 200;
  ctx.body = mapper(price);
};

module.exports.delete = async (ctx) => {
  const price = await _getPrice();

  if (!price) {
    ctx.throw(404, 'price not found');
  }

  await _deletePrice();
  await _deleteFile(path.join(__dirname, `../files/price/${price.fileName}`));

  ctx.status = 200;
};

function _getPrice() {
  return Price.findOne();
}

function _addPrice(fileName) {
  return Price.create({ fileName });
}

function _deletePrice() {
  return Price.deleteMany();
}

async function _processingFile(file) {
  await fs.rename(
    file.filepath,
    path.join(__dirname, `../files/price/${file.originalFilename}`),
  )
    .catch((error) => logger.error(error.mesasge));

  return {
    fileName: file.originalFilename,
  };
}

function _deleteFile(fpath) {
  return fs.unlink(fpath)
    .catch((error) => {
      if (error.code === 'ENOENT') {
        logger.error('попытка удалить не существующий файл');
        return;
      }
      logger.error(`delete file: ${error.message}`);
    });
}
