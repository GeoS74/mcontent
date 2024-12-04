const fs = require('fs/promises');
const sharp = require('sharp');
const path = require('path');
const Team = require('../models/Team');
const mapper = require('../mappers/team.mapper');
const logger = require('../libs/logger');

module.exports.get = async (ctx) => {
  const teamUnit = await _getTeamUnit(ctx.params.id);

  if (!teamUnit) {
    ctx.throw(404, 'team unit not found');
  }
  ctx.status = 200;
  ctx.body = mapper(teamUnit);
};

module.exports.add = async (ctx) => {
  ctx.request.body.photo = await _processingImage(ctx.request.files.photo);

  const teamUnit = await _addTeamUnit(ctx.request.body);

  ctx.status = 201;
  ctx.body = mapper(teamUnit);
};

module.exports.update = async (ctx) => {
  ctx.request.body.photo = ctx.request?.files?.photo
    ? await _processingImage(ctx.request.files.photo) : undefined;

  let teamUnit = await _getTeamUnit(ctx.params.id);

  if (!teamUnit) {
    if (ctx.request.files) {
      // убрать временные файлы
      _deleteFiles(ctx.request.files);
    }
    ctx.throw(404, 'team unit not found');
  }

  // убрать старый файл
  if (ctx.request.body.photo) {
    _deleteFile(path.join(__dirname, `../files/images/team/${teamUnit.photo.fileName}`));
  }

  teamUnit = await _updateTeamUnit(ctx.params.id, ctx.request.body);

  ctx.status = 200;
  ctx.body = mapper(teamUnit);
};

module.exports.delete = async (ctx) => {
  const teamUnit = await _deleteTeamUnit(ctx.params.id);

  if (!teamUnit) {
    ctx.throw(404, 'team unit not found');
  }

  /* delete images */
  if (teamUnit.photo) {
    _deleteFile(path.join(__dirname, `../files/images/team/${teamUnit.photo.fileName}`));
  }

  ctx.status = 200;
  ctx.body = mapper(teamUnit);
};

function _getTeamUnit(id) {
  return Team.findById(id);
}

function _addTeamUnit({
  name,
  position,
  isPublic,
  photo,
}) {
  return Team.create({
    name,
    position,
    isPublic: !!isPublic,
    photo,
  });
}

function _updateTeamUnit(id, {
  name,
  position,
  isPublic,
  photo,
}) {
  return Team.findByIdAndUpdate(
    id,
    {
      name,
      position,
      isPublic: !!isPublic,
      photo,
    },
    {
      new: true,
    },
  );
}

function _deleteTeamUnit(id) {
  return Team.findByIdAndDelete(id);
}

async function _processingImage(image) {
  await _resizePhoto(image.filepath, path.join(__dirname, `../files/images/team/${image.newFilename}`))
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
      width: 700,
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
  const teamUnits = await _searchTeamUnits(data);

  ctx.body = teamUnits.map((teamUnit) => (mapper(teamUnit)));
  ctx.status = 200;
};

async function _searchTeamUnits(data) {
  return Team.find(data.filter, data.projection)
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
