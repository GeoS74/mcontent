const fs = require('fs/promises');
const sharp = require('sharp');
const path = require('path');
const Testimonial = require('../models/Testimonial');
const mapper = require('../mappers/testimonial.mapper');
const logger = require('../libs/logger');

module.exports.get = async (ctx) => {
  const testimonial = await _getTestimonial(ctx.params.id);

  if (!testimonial) {
    ctx.throw(404, 'testimonial not found');
  }
  ctx.status = 200;
  ctx.body = mapper(testimonial);
};

module.exports.add = async (ctx) => {
  ctx.request.body.photo = await _processingImage(ctx.request.files.photo);

  const testimonial = await _addTestimonial(ctx.request.body);

  ctx.status = 201;
  ctx.body = mapper(testimonial);
};

module.exports.update = async (ctx) => {
  ctx.request.body.photo = ctx.request?.files?.photo
    ? await _processingImage(ctx.request.files.photo) : undefined;

  let testimonial = await _getTestimonial(ctx.params.id);

  if (!testimonial) {
    if (ctx.request.files) {
      // убрать временные файлы
      _deleteFiles(ctx.request.files);
    }
    ctx.throw(404, 'testimonial not found');
  }

  // убрать старый файл
  if (ctx.request.body.photo) {
    _deleteFile(path.join(__dirname, `../files/images/testimonial/${testimonial.photo.fileName}`));
  }

  testimonial = await _updateTestimonial(ctx.params.id, ctx.request.body);

  ctx.status = 200;
  ctx.body = mapper(testimonial);
};

module.exports.delete = async (ctx) => {
  const testimonial = await _deleteTestimonial(ctx.params.id);

  if (!testimonial) {
    ctx.throw(404, 'testimonial not found');
  }

  /* delete images */
  if (testimonial.photo) {
    _deleteFile(path.join(__dirname, `../files/images/testimonial/${testimonial.photo.fileName}`));
  }

  ctx.status = 200;
  ctx.body = mapper(testimonial);
};

function _getTestimonial(id) {
  return Testimonial.findById(id);
}

function _addTestimonial({
  name,
  message,
  company,
  isPublic,
  photo,
}) {
  return Testimonial.create({
    name,
    message,
    company,
    isPublic: !!isPublic,
    photo,
  });
}

function _updateTestimonial(id, {
  name,
  message,
  company,
  isPublic,
  photo,
}) {
  return Testimonial.findByIdAndUpdate(
    id,
    {
      name,
      message,
      company,
      isPublic: !!isPublic,
      photo,
    },
    {
      new: true,
    },
  );
}

function _deleteTestimonial(id) {
  return Testimonial.findByIdAndDelete(id);
}

async function _processingImage(image) {
  await _resizePhoto(image.filepath, path.join(__dirname, `../files/images/testimonial/${image.newFilename}`))
    .catch((error) => logger.error(`error resizing image: ${error.message}`));

  _deleteFile(image.filepath);

  // перемещение файла без обработки
  // await fs.rename(image.filepath,
  //  path.join(__dirname, `../files/images/testimonial/${image.newFilename}`))
  //   .catch((error) => logger.error(error.mesasge));

  return {
    originalName: image.originalFilename,
    fileName: image.newFilename,
  };
}

async function _resizePhoto(filepath, newFilename) {
  return sharp(filepath)
    .resize({
      width: 200,
      height: 200,
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
//  * вывод всех записей
//  *
//  * возможные параметры запроса:
//  * - limit
//  * - isPublic
//  *
//  */

module.exports.getAll = async (ctx) => {
  const data = _makeFilterRules(ctx.query);
  const testimonials = await _searchTestimonial(data);

  ctx.body = testimonials.map((testimonial) => (mapper(testimonial)));
  ctx.status = 200;
};

async function _searchTestimonial(data) {
  return Testimonial.find(data.filter)
    .sort({ _id: -1 })
    .limit(data.limit);
}

function _makeFilterRules({
  limit,
  isPublic,
}) {
  const filter = {};

  if (isPublic) {
    filter.isPublic = true;
  }

  return { filter, limit };
}
