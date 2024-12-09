const CatalogLevel = require('../models/CatalogLevel');
const mapper = require('../mappers/catalog.level.mapper');

module.exports.getAll = async (ctx) => {
  const levels = await _getLevels();

  ctx.status = 200;
  ctx.body = levels.map((level) => (mapper(level)));
};

module.exports.get = async (ctx) => {
  const level = await _getLevel(ctx.params.id);

  ctx.status = 200;
  ctx.body = mapper(level);
};

module.exports.add = async (ctx) => {
  const level = await _addLevel(ctx.request.body);

  ctx.status = 201;
  ctx.body = mapper(level);
};

module.exports.update = async (ctx) => {
  const level = await _updateLevel(ctx.params.id, ctx.request.body);

  ctx.status = 200;
  ctx.body = mapper(level);
};

module.exports.delete = async (ctx) => {
  const level = await _getLevel(ctx.params.id);

  if (!level) {
    ctx.throw(404, 'level not found');
  }

  /*
  *здесь надо написать проверку на привязанные позиции каталога
  *
  */

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

function _deleteLevel(id) {
  return CatalogLevel.findByIdAndDelete(id);
}

function _updateLevel(id, {
  title,
  parent,
}) {
  return CatalogLevel.findByIdAndUpdate(
    id,
    {
      title,
      parent: parent || null,
    },
    {
      new: true,
    },
  );
}

function _getLevel(id) {
  return CatalogLevel.findById(id)
    .populate({
      path: 'childs',
      populate: { path: 'childs' },
    });
}

function _getLevels() {
  return CatalogLevel.find({
    $or: [
      { parent: { $exists: false } },
      { parent: null }],
  })
    .populate({
      path: 'childs',
      populate: { path: 'childs' },
    });
}

function _addLevel({
  title,
  parent,
}) {
  return CatalogLevel.create({
    title,
    parent,
  });
}
