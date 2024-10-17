const TemplatePage = require('../models/TemplatePage');
const mapper = require('../mappers/templatePage.mapper');
const logger = require('../libs/logger');

/**
 * Cписок шаблонов страниц жёстко зафиксирован и
 * в момент создания базы данных создаётся автоматически и изменению не подлежит,
 * записи получают каждый раз новые id, поэтому использовать их не имеет смысла
 *
 * FROZEN_LIST вызывается функциями при этом обращений к БД нет
 */

const FROZEN_LIST = new Map();
TemplatePage
  .find({})
  .then((res) => res.map((e) => FROZEN_LIST.set(e.id, mapper(e))))
  .catch((error) => logger.error(error.message));

module.exports.get = async (ctx) => {
  ctx.status = 200;
  ctx.body = Array.from(FROZEN_LIST.values());
};
