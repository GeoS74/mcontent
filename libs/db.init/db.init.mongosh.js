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
    name: 'Страница контактов',
    tplFileName: 'contact.html',
    alias: 'contact'
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
