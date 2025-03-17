const fs = require('fs/promises');
const sharp = require('sharp');
const path = require('path');
const CatalogPosition = require('../models/CatalogPosition');
const mapper = require('../mappers/catalog.position.mapper');
const logger = require('../libs/logger');

module.exports.get = async (ctx) => {
  const position = await _getPosition(ctx.params.id);

  if (!position) {
    ctx.throw(404, 'position not found');
  }
  ctx.status = 200;
  ctx.body = mapper(position);
};

module.exports.add = async (ctx) => {
  ctx.request.body.image = ctx.request?.files?.image
    ? await _processingImage(ctx.request.files.image) : undefined;

  const position = await _addPosition(ctx.request.body);

  ctx.status = 201;
  ctx.body = mapper(position);
};

module.exports.update = async (ctx) => {
  ctx.request.body.image = ctx.request?.files?.image
    ? await _processingImage(ctx.request.files.image) : undefined;

  let position = await _getPosition(ctx.params.id);

  if (!position) {
    if (ctx.request.files) {
      // убрать временные файлы
      _deleteFiles(ctx.request.files);
    }
    ctx.throw(404, 'position not found');
  }

  // есть прикреплённое изображение
  if (position.image?.fileName) {
    // если загружается новый файл, то удалить старый файл
    // если новый файл не загружается, проверить существование поля delCurrentImage
    // если оно есть, то удалить существующий файл и удалить запись о нём в БД
    if (ctx.request.body.image) {
      _deleteFile(path.join(__dirname, `../files/images/catalog/${position.image.fileName}`));
    } else if (ctx.request.body.delCurrentImage) {
      _deleteFile(path.join(__dirname, `../files/images/catalog/${position.image.fileName}`));
      await _unsetImage(ctx.params.id);
    }
  }

  position = await _updatePosition(ctx.params.id, ctx.request.body);

  ctx.status = 200;
  ctx.body = mapper(position);
};

module.exports.delete = async (ctx) => {
  const position = await _deletePosition(ctx.params.id);

  if (!position) {
    ctx.throw(404, 'position not found');
  }

  /* delete images */
  if (position.image?.fileName) {
    _deleteFile(path.join(__dirname, `../files/images/catalog/${position.image.fileName}`));
  }

  ctx.status = 200;
  ctx.body = mapper(position);
};

function _getPosition(id) {
  return CatalogPosition.findById(id)
    .populate({ path: 'level' });
}

function _addPosition({
  title,
  article,
  description,
  isPublic,
  image,
  level,
}) {
  return CatalogPosition.create({
    title,
    article,
    description,
    isPublic: !!isPublic,
    image,
    level,
  }).then((p) => p.populate({ path: 'level' }));
}

function _updatePosition(id, {
  title,
  article,
  description,
  isPublic,
  image,
  level,
}) {
  return CatalogPosition.findByIdAndUpdate(
    id,
    {
      title,
      article,
      description,
      isPublic,
      image,
      level,
    },
    {
      new: true,
    },
  )
    .populate({ path: 'level' });
}

function _deletePosition(id) {
  return CatalogPosition.findByIdAndDelete(id)
    .populate({ path: 'level' });
}

function _unsetImage(id) {
  return CatalogPosition.findByIdAndUpdate(
    id,
    { $unset: { image: '' } },
  );
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
      width: 400,
      height: 400,
      fit: 'cover',
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

// /**
//  * поиск записи
//  *
//  * возможные параметры запроса:
//  * - search
//  * - last
//  * - limit
//  * - isPublic
//  *
//  */

module.exports.search = async (ctx) => {
  const data = _makeFilterRules(ctx.query);
  const positions = await _searchSide(data);

  ctx.body = positions.map((pos) => (mapper(pos)));
  ctx.status = 200;
};

async function _searchSide(data) {
  return CatalogPosition.find(data.filter, data.projection)
    .sort({
      _id: -1,
      //  score: { $meta: "textScore" } //сортировка по релевантности
    })
    .limit(data.limit)
    .populate({ path: 'level' });
}

function _makeFilterRules({
  search,
  level,
  lastId,
  limit,
  isPublic,
}) {
  const filter = {};
  const projection = {};

  if (search) {
    filter.$text = {
      $search: search,
      $language: 'russian',
    };

    projection.score = { $meta: 'textScore' }; // добавить в данные оценку текстового поиска (релевантность)
  }

  if (level) {
    filter.level = level;
  }

  if (lastId) {
    filter._id = { $lt: lastId };
  }

  if (isPublic) {
    filter.isPublic = true;
  }

  return { filter, projection, limit };
}
