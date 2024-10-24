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
      name: 'Главная страница сайта',
      tplFileName: 'index.html',
    },
    {
      name: 'Каталог товаров',
      tplFileName: 'products.html',
    },
    {
      name: 'Страница товара',
      tplFileName: 'product-single.html',
    },
    {
      name: 'Страница о компании',
      tplFileName: 'about.html',
    },
    {
      name: 'Страница контактов',
      tplFileName: 'contact.html',
    },
  ])
    .then(() => logger.info('create and init collection "templatepages"'))
    .catch((error) => logger.warn(error.message))
    .finally(() => process.exit());
})();
