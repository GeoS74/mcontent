const Solution = require('../models/Solution');
// используется маппер progress, т.к. они идентичны
const mapper = require('../mappers/progress.mapper');

module.exports.get = async (ctx) => {
  const solution = await _get(ctx.params.id);

  if (!solution) {
    ctx.throw(404, 'solution not found');
  }
  ctx.status = 200;
  ctx.body = mapper(solution);
};

module.exports.add = async (ctx) => {
  const solution = await _add(ctx.request.body);

  ctx.status = 201;
  ctx.body = mapper(solution);
};

module.exports.update = async (ctx) => {
  const solution = await _update(ctx.params.id, ctx.request.body);

  if (!solution) {
    ctx.throw(404, 'solution not found');
  }

  ctx.status = 200;
  ctx.body = mapper(solution);
};

module.exports.delete = async (ctx) => {
  const solution = await _delete(ctx.params.id);

  if (!solution) {
    ctx.throw(404, 'solution not found');
  }

  ctx.status = 200;
  ctx.body = mapper(solution);
};

function _get(id) {
  return Solution.findById(id);
}

function _add({
  title,
  message,
  cssClass,
  isPublic,
}) {
  return Solution.create({
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
  return Solution.findByIdAndUpdate(
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
  return Solution.findByIdAndDelete(id);
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
  const solutions = await _search(data);

  ctx.body = solutions.map((solution) => (mapper(solution)));
  ctx.status = 200;
};

async function _search(data) {
  return Solution.find(data.filter, data.projection)
    .sort({
      _id: 1,
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
