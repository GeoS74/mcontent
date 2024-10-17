const connection = require('./connection');
const logger = require('./logger');
const config = require('../config');
const TemplatePage = require('../models/TemplatePage');

(async () => {
  // dropped database
  if (process.argv[2] === '--drop') {
    await connection.dropDatabase()
      .then(() => logger.info(`database "${config.mongodb.database}" dropped`))
      .catch((error) => logger.warn(error.message))
      .finally(() => process.exit());
  }

  TemplatePage.insertMany([
    {
      title: 'Главная страница сайта',
      tplFileName: 'index.html',
    },
    {
      title: 'Каталог товаров',
      tplFileName: 'products.html',
    },
    {
      title: 'Страница товара',
      tplFileName: 'product-single.html',
    },
    {
      title: 'Страница о компании',
      tplFileName: 'about.html',
    },
    {
      title: 'Страница контактов',
      tplFileName: 'contact.html',
    },
  ])
    .then(() => logger.info('create and init collection "actions"'))
    .catch((error) => logger.warn(error.message))
    .finally(() => process.exit());
})();
