const TemplatePage = require('../models/TemplatePage');
const mapper = require('../mappers/templatePage.mapper');
// const logger = require('../libs/logger');

/**
 * Cписок шаблонов страниц жёстко зафиксирован и
 * в момент создания базы данных создаётся автоматически и изменению не подлежит,
 * записи получают каждый раз новые id, поэтому использовать их не имеет смысла
 * для доступа к записям используется имя шаблона
 *
 */

module.exports.get = async (ctx) => {
  const template = await _getTemplate(ctx.params.alias);

  if (!template) {
    ctx.throw(404, 'template not found');
  }
  ctx.status = 200;
  ctx.body = mapper(template);
};

module.exports.getAll = async (ctx) => {
  const templates = await _getAll();

  ctx.status = 200;
  ctx.body = templates.map((t) => (mapper(t)));
};

module.exports.update = async (ctx) => {
  const template = await _updateTemplateTag(ctx.params.alias, ctx.request.body);

  if (!template) {
    ctx.throw(404, 'template not found');
  }

  ctx.status = 200;
  ctx.body = mapper(template);
};

function _getAll() {
  return TemplatePage
    .find({})
    .sort({ _id: 1 });
}

function _getTemplate(alias) {
  return TemplatePage.findOne({ alias });
}

function _updateTemplateTag(alias, {
  title,
  description,
  meta,
}) {
  return TemplatePage.findOneAndUpdate(
    { alias },
    {
      title,
      description,
      meta: {
        title: meta.title,
        description: meta.description,
      },
    },
    {
      new: true,
    },
  );
}
