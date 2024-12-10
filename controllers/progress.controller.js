const Progress = require('../models/Progress');
const mapper = require('../mappers/progress.mapper');

module.exports.get = async (ctx) => {
  const progress = await _get(ctx.params.id);

  if (!progress) {
    ctx.throw(404, 'progress not found');
  }
  ctx.status = 200;
  ctx.body = mapper(progress);
};

module.exports.add = async (ctx) => {
  const progress = await _add(ctx.request.body);

  ctx.status = 201;
  ctx.body = mapper(progress);
};

module.exports.update = async (ctx) => {
  const progress = await _update(ctx.params.id, ctx.request.body);

  if (!progress) {
    ctx.throw(404, 'progress not found');
  }

  ctx.status = 200;
  ctx.body = mapper(progress);
};

module.exports.delete = async (ctx) => {
  const progress = await _delete(ctx.params.id);

  if (!progress) {
    ctx.throw(404, 'progress not found');
  }

  ctx.status = 200;
  ctx.body = mapper(progress);
};

function _get(id) {
  return Progress.findById(id);
}

function _add({
  title,
  message,
  cssClass,
  isPublic,
}) {
  return Progress.create({
    title,
    message,
    cssClass,
    isPublic: !!isPublic,
  });
}

function _update(id, {
  title,
  message,
  cssClass,
  isPublic,
}) {
  return Progress.findByIdAndUpdate(
    id,
    {
      title,
      message,
      cssClass,
      isPublic: !!isPublic,
    },
    {
      new: true,
    },
  );
}

function _delete(id) {
  return Progress.findByIdAndDelete(id);
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
  const progresses = await _search(data);

  ctx.body = progresses.map((progress) => (mapper(progress)));
  ctx.status = 200;
};

async function _search(data) {
  return Progress.find(data.filter, data.projection)
    .sort({
      _id: 1,
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
