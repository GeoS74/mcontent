const { readdirSync, mkdirSync } = require('node:fs');
const { unlink } = require('fs/promises');
const logger = require('./logger');

module.exports.dirInit = (dir) => {
  try {
    readdirSync(dir);
  } catch (error) {
    mkdirSync(dir, { recursive: true });
  }
};

// ожидает получить ctx.request.files или строку
module.exports.deleteFile = async (fpath) => {
  if (!fpath) return;

  unlink(fpath)
    .catch((error) => {
      if (error.code === 'ENOENT') {
        logger.error(`попытка удалить не существующий файл: ${fpath}`);
        return;
      }
      logger.error(`delete file: ${error.message}`);
    });
};
