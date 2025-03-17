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
module.exports.deleteFiles = (f) => {
  if (!f) return;

  if (typeof f === 'string') {
    _deleteFile(f);
    return;
  }

  for (const file of Object.values(f)) {
    // received more than 1 file in any field with the same name
    if (Array.isArray(file)) {
      this.deleteFiles(file);
    } else {
      _deleteFile(file.filepath);
    }
  }
};

async function _deleteFile(fpath) {
  unlink(fpath)
    .catch((error) => {
      if (error.code === 'ENOENT') {
        logger.error(`попытка удалить не существующий файл: ${fpath}`);
        return;
      }
      logger.error(`delete file: ${error.message}`);
    });
}
