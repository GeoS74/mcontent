db.templatepages.insertMany([
  {
    name: 'Главная страница сайта',
    tplFileName: 'index.html',
    alias: 'index'
  },
  {
    name: 'Каталог товаров',
    tplFileName: 'products.html',
    alias: 'products'
  },
  {
    name: 'Разделы каталога',
    tplFileName: 'section.html',
    alias: 'section'
  },
  {
    name: 'Страница товара',
    tplFileName: 'product-single.html',
    alias: 'product-single'
  },
  {
    name: 'Страница о компании',
    tplFileName: 'about.html',
    alias: 'about'
  },
  {
    name: 'Статьи компании',
    tplFileName: 'simple-article.html',
    alias: 'simple-article'
  },
  {
    name: 'Страница контактов',
    tplFileName: 'contact.html',
    alias: 'contact'
  },
  {
    name: 'Сервис',
    tplFileName: 'services.html',
    alias: 'services'
  },
]);

db.contacts.insertMany([
  {
    title: 'Адрес',
    alias: 'address',
    value: ''
  },
  {
    title: 'Телефон',
    alias: 'telephone',
    value: ''
  },
  {
    title: 'email',
    alias: 'email',
    value: ''
  },
]);
