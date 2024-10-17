const fs = require('fs/promises');
const sharp = require('sharp');
const path = require('path');
const Slide = require('../models/Slide');
const mapper = require('../mappers/slider.mapper');
const logger = require('../libs/logger');

module.exports.get = async (ctx) => {
  const slide = await _getSlide(ctx.params.id);

  if (!slide) {
    ctx.throw(404, 'slide not found');
  }
  ctx.status = 200;
  ctx.body = mapper(slide);
};

module.exports.add = async (ctx) => {
  ctx.request.body.image = await _processingImage(ctx.request.files.image);

  const slide = await _addSlide(ctx.request.body);

  ctx.status = 201;
  ctx.body = mapper(slide);
};

module.exports.update = async (ctx) => {
  ctx.request.body.image = ctx.request?.files?.image
    ? await _processingImage(ctx.request.files.image) : undefined;

  let slide = _getSlide(ctx.params.id);

  if (!slide) {
    if (ctx.request.files) {
      // убрать временные файлы
      _deleteFiles(ctx.request.files);
    }
    ctx.throw(404, 'slide not found');
  }

  // убрать старый файл
  if (ctx.request.body.image) {
    _deleteFile(path.join(__dirname, `../files/images/slider/${slide.image.fileName}`));
  }

  slide = await _updateSlide(ctx.params.id, ctx.request.body);

  ctx.status = 200;
  ctx.body = mapper(slide);
};

module.exports.delete = async (ctx) => {
  const slide = await _deleteSlide(ctx.params.id);

  if (!slide) {
    ctx.throw(404, 'slide not found');
  }

  /* delete images */
  if (slide.image) {
    _deleteFile(path.join(__dirname, `../files/images/slider/${slide.image.fileName}`));
  }

  ctx.status = 200;
  ctx.body = mapper(slide);
};

function _getSlide(id) {
  return Slide.findById(id);
}

function _addSlide({
  title,
  message,
  isPublic,
  image,
}) {
  return Slide.create({
    title,
    message,
    isPublic,
    image,
  });
}

function _updateSlide(id, {
  title,
  message,
  isPublic,
  image,
}) {
  return Slide.findByIdAndUpdate(
    id,
    {
      title,
      message,
      isPublic,
      image,
    },
    {
      new: true,
    },
  );
}

function _deleteSlide(id) {
  return Slide.findByIdAndDelete(id);
}

async function _processingImage(image) {
  await _resizePhoto(image.filepath, path.join(__dirname, `../files/images/slider/${image.newFilename}`))
    .catch((error) => logger.error(`error resizing image: ${error.message}`));

  _deleteFile(image.filepath);

  // перемещение файла без обработки
  // await fs.rename(image.filepath,
  //  path.join(__dirname, `../files/images/slider/${image.newFilename}`))
  //   .catch((error) => logger.error(error.mesasge));

  return {
    originalName: image.originalFilename,
    fileName: image.newFilename,
  };
}

async function _resizePhoto(filepath, newFilename) {
  return sharp(filepath)
    .resize({
      width: 1900,
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
  const slides = await _searchSide(data);

  ctx.body = slides.map((slide) => (mapper(slide)));
  ctx.status = 200;
};

async function _searchSide(data) {
  return Slide.find(data.filter, data.projection)
    .sort({
      _id: -1,
      //  score: { $meta: "textScore" } //сортировка по релевантности
    })
    .limit(data.limit);
}

function _makeFilterRules({
  search,
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

  if (lastId) {
    filter._id = { $lt: lastId };
  }

  if (isPublic) {
    filter.isPublic = true;
  }

  return { filter, projection, limit };
}
