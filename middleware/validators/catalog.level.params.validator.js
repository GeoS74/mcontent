const { isValidObjectId } = require('mongoose');
const CatalogLevel = require('../../models/CatalogLevel');

module.exports.title = async (ctx, next) => {
  const title = _checkText(ctx.request?.body?.title);

  if (!title) {
    ctx.throw(400, 'title is empty');
  }

  ctx.request.body.title = title;

  await next();
};

module.exports.parent = async (ctx, next) => {
  if (ctx.request.body.parent) {
    if (!isValidObjectId(ctx.request.body.parent)) {
      ctx.throw(400, 'invalid parent id of catalog level');
    }

    try {
      await _checkParent(ctx.params.id, ctx.request.body.parent);
    } catch (e) {
      ctx.throw(400, e.message);
    }
  }

  await next();
};

module.exports.objectId = async (ctx, next) => {
  if (!ctx.params.id || !isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid catalog level id');
  }

  await next();
};

/*
функция рекурсивно поднимается по дереву вверх используя id родителя
выбросит ошибку если:
1) родителя по id не существует
2) попытка подчинить раздел самому себе
3) попытка подчинить раздел своему потомку
*/
async function _checkParent(id, parentId) {
  const parent = await CatalogLevel.findById(parentId);

  if (!parent) {
    throw new Error('parent not exists');
  }

  if (parent.id === id) {
    throw new Error('cannot be subordinated to oneself or nested level');
  }

  if (parent.parent) {
    await _checkParent(id, parent.parent);
  }
}

function _checkText(text) {
  return text?.trim();
}
