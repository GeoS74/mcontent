const { readdir, stat, unlink } = require('node:fs/promises');
const path = require('path');
const logger = require('./logger');
const config = require('../config');

module.exports = function cleaner(ms) {
  setTimeout(async () => {
    const now = Date.now();
    try {
      const files = await readdir(config.tempFiles.dir, { withFileTypes: true });
      for (const file of files) {
        if (file.isFile()) {
          const fpath = path.join(config.tempFiles.dir, file.name);
          const f = await stat(fpath);

          if ((now - f.ctimeMs) > config.tempFiles.maxms) {
            await unlink(fpath);
          }
        }
      }
    } catch (err) {
      logger.error(err.message);
    }

    cleaner(config.tempFiles.maxms);
  }, ms);
};
