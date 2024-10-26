const connection = require('./connection');
const logger = require('./logger');
const config = require('../config');
const TemplatePage = require('../models/TemplatePage');
const Contact = require('../models/Contact');

(async () => {
  // dropped database
  if (process.argv[2] === '--drop') {
    await connection.dropDatabase()
      .then(() => logger.info(`database "${config.mongodb.database}" dropped`))
      .catch((error) => logger.warn(error.message))
      .finally(() => process.exit());
  }

  await Contact.insertMany([
    {
      title: 'Адрес',
      alias: 'address',
      value: '',
    },
    {
      title: 'Телефон',
      alias: 'telephone',
      value: '',
    },
    {
      title: 'email',
      alias: 'email',
      value: '',
    },
  ])
    .then(() => logger.info('create and init collection "contacts"'))
    .catch((error) => logger.warn(error.message));

  await TemplatePage.insertMany([
    {
      name: 'Главная страница сайта',
      tplFileName: 'index.html',
      alias: 'index',
    },
    {
      name: 'Каталог товаров',
      tplFileName: 'products.html',
      alias: 'products',
    },
    {
      name: 'Страница товара',
      tplFileName: 'product-single.html',
      alias: 'product-single',
    },
    {
      name: 'Страница о компании',
      tplFileName: 'about.html',
      alias: 'about',
    },
    {
      name: 'Страница контактов',
      tplFileName: 'contact.html',
      alias: 'contact',
    },
  ])
    .then(() => logger.info('create and init collection "templatepages"'))
    .catch((error) => logger.warn(error.message))
    .finally(() => process.exit());
})();
