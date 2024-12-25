const fs = require('fs/promises');
const sharp = require('sharp');
const path = require('path');
const CatalogLevel = require('../models/CatalogLevel');
const CatalogPosition = require('../models/CatalogPosition');
const mapper = require('../mappers/catalog.level.mapper');
const logger = require('../libs/logger');

module.exports.getAll = async (ctx) => {
  const levels = await _getLevels();

  ctx.status = 200;
  ctx.body = levels.map((level) => (mapper(level)));
};

module.exports.get = async (ctx) => {
  const level = await _getLevel(ctx.params.id);

  if (!level) {
    ctx.throw(404, 'level not found');
  }

  ctx.status = 200;
  ctx.body = mapper(level);
};

module.exports.add = async (ctx) => {
  ctx.request.body.image = await _processingImage(ctx.request.files.image);

  const level = await _addLevel(ctx.request.body);

  ctx.status = 201;
  ctx.body = mapper(level);
};

module.exports.update = async (ctx) => {
  ctx.request.body.image = ctx.request?.files?.image
    ? await _processingImage(ctx.request.files.image) : undefined;

  let level = await _getLevel(ctx.params.id);

  if (!level) {
    if (ctx.request.files) {
      // убрать временные файлы
      _deleteFiles(ctx.request.files);
    }
    ctx.throw(404, 'level not found');
  }

  // убрать старый файл
  if (ctx.request.body.image) {
    _deleteFile(path.join(__dirname, `../files/images/catalog/${level.image.fileName}`));
  }

  level = await _updateLevel(ctx.params.id, ctx.request.body);

  ctx.status = 200;
  ctx.body = mapper(level);
};

module.exports.delete = async (ctx) => {
  const level = await _getLevel(ctx.params.id);

  if (!level) {
    ctx.throw(404, 'level not found');
  }

  // проверка на привязанные позиции каталога
  const relatedPosition = await _getRelatedPosition(level.id);
  if (relatedPosition) {
    ctx.throw(400, 'level has associated positions');
  }

  // если есть вложенные уровни, то вынести их на уровень выше
  if (level?.childs?.length) {
    level.childs.map(async (nested) => {
      await _updateLevel(nested.id, {
        parent: level.parent,
      });
    });
  }

  await _deleteLevel(ctx.params.id);

  ctx.status = 200;
  ctx.body = mapper(level);
};

function _getRelatedPosition(levelId) {
  return CatalogPosition.findOne({ level: levelId });
}

function _deleteLevel(id) {
  return CatalogLevel.findByIdAndDelete(id);
}

function _updateLevel(id, {
  title,
  parent,
  image,
}) {
  return CatalogLevel.findByIdAndUpdate(
    id,
    {
      title,
      parent: parent || null,
      image,
    },
    {
      new: true,
    },
  );
}

function _getLevel(id) {
  return CatalogLevel.findById(id);
}

function _getLevels() {
  return CatalogLevel.find({
    $or: [
      { parent: { $exists: false } },
      { parent: null }],
  });
}

function _addLevel({
  title,
  parent,
  image,
}) {
  return CatalogLevel.create({
    title,
    parent,
    image,
  });
}

async function _processingImage(image) {
  await _resizePhoto(image.filepath, path.join(__dirname, `../files/images/catalog/${image.newFilename}`))
    .catch((error) => logger.error(`error resizing image: ${error.message}`));

  _deleteFile(image.filepath);

  return {
    originalName: image.originalFilename,
    fileName: image.newFilename,
  };
}

async function _resizePhoto(filepath, newFilename) {
  return sharp(filepath)
    .resize({
      width: 250,
      // height: 350,
    })
    .toFile(newFilename);
}

function _deleteFile(fpath) {
  fs.unlink(fpath)
    .catch((error) => {
      if (error.code === 'ENOENT') {
        logger.error('попытка удалить не существующий файл');
        return;
      }
      logger.error(`delete file: ${error.message}`);
    });
}

function _deleteFiles(files) {
  for (const file of Object.values(files)) {
    // received more than 1 file in any field with the same name
    if (Array.isArray(file)) {
      _deleteFiles(file);
    } else {
      _deleteFile(file.filepath);
    }
  }
}
