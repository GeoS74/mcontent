const sharp = require('sharp');
const path = require('path');
const Note = require('../models/Note');
const mapper = require('../mappers/note.mapper');
const logger = require('../libs/logger');
const { deleteFile } = require('../libs/common');

module.exports.get = async (ctx) => {
  const note = await _getNote(ctx.params.id);

  if (!note) {
    ctx.throw(404, 'note not found');
  }
  ctx.status = 200;
  ctx.body = mapper(note);
};

module.exports.getByAlias = async (ctx) => {
  const note = await _getByAlias(ctx.params.alias);

  if (!note) {
    ctx.throw(404, 'note not found');
  }

  ctx.status = 200;
  ctx.body = mapper(note);
};

module.exports.add = async (ctx) => {
  ctx.request.body.image = await _processingImage(ctx.request.body.image);

  const note = await _addNote(ctx.request.body);

  ctx.status = 201;
  ctx.body = mapper(note);
};

module.exports.update = async (ctx) => {
  if (ctx.request.body.image) {
    ctx.request.body.image = await _processingImage(ctx.request.body.image);
  }

  let note = await _getNote(ctx.params.id);

  if (!note) {
    ctx.throw(404, 'note not found');
  }

  // убрать старый файл
  if (ctx.request.body.image) {
    deleteFile(path.join(__dirname, `../files/images/note/${note.image.fileName}`));
  }

  note = await _updateNote(ctx.params.id, ctx.request.body);

  ctx.status = 200;
  ctx.body = mapper(note);
};

module.exports.delete = async (ctx) => {
  const note = await _deleteNote(ctx.params.id);

  if (!note) {
    ctx.throw(404, 'note not found');
  }

  /* delete images */
  if (note.image) {
    deleteFile(path.join(__dirname, `../files/images/note/${note.image.fileName}`));
  }

  ctx.status = 200;
  ctx.body = mapper(note);
};

function _getNote(id) {
  return Note.findById(id);
}

function _addNote({
  title,
  message,
  isPublic,
  image,
}) {
  return Note.create({
    title,
    message,
    isPublic: !!isPublic,
    image,
  });
}

function _updateNote(id, {
  title,
  message,
  isPublic,
  image,
}) {
  return Note.findByIdAndUpdate(
    id,
    {
      title,
      message,
      isPublic: !!isPublic,
      image,
    },
    {
      new: true,
    },
  );
}

function _deleteNote(id) {
  return Note.findByIdAndDelete(id);
}

async function _processingImage(image) {
  await _resizePhoto(image.filepath, path.join(__dirname, `../files/images/note/${image.newFilename}.webp`))
    .catch((error) => logger.error(`error resizing image: ${error.message}`));

  deleteFile(image.filepath);

  return {
    originalName: `${image.originalFilename}.webp`,
    fileName: `${image.newFilename}.webp`,
  };
}

async function _resizePhoto(filepath, newFilename) {
  return sharp(filepath)
    .resize({
      width: 1200,
      // height: 350,
    })
    .toFormat('webp', {
      quality: 80, // Качество от 1 до 100
      lossless: false, // Использовать lossless-сжатие
      nearLossless: false,
      alphaQuality: 100, // Качество альфа-канала
      effort: 6, // Уровень оптимизации (1-6)
    })
    .toFile(newFilename);
}

function _getByAlias(alias) {
  return Note.findOne({ alias });
}

// /**
//  * поиск записи
//  *
//  * возможные параметры запроса:
//  * - last
//  * - limit
//  * - isPublic
//  *
//  */
module.exports.search = async (ctx) => {
  const data = _makeFilterRules(ctx.query);
  const notes = await _searchNote(data);

  ctx.body = notes.map((note) => (mapper(note)));
  ctx.status = 200;
};

async function _searchNote(data) {
  return Note.find(data.filter, data.projection)
    .sort({
      _id: -1,
    })
    .limit(data.limit);
}

function _makeFilterRules({
  lastId,
  limit,
  isPublic,
}) {
  const filter = {};
  const projection = {};

  if (lastId) {
    filter._id = { $lt: lastId };
  }

  if (isPublic) {
    filter.isPublic = true;
  }

  return { filter, projection, limit };
}
