# mcontent

Микросервис для хранения данных, отображаемых на сайте.

## API личный кабинет

## API слайдера главной страницы

Запрос всех слайдов
`GET /api/mcontent/slider/public/search`

возвращает массив объектов:
```
{
  id: идентификатор слайда,
  title: заголовок (может быть пустой строкой),
  message: текст (может быть пустой строкой),
  isPublic: булево значение,
  image: {
    originalName: исходное имя файла,
    fileName: текущее имя файла,
  },
  createdAt: дата создания,
  updatedAt: дата обновления,
}
```

Получить изображение слайда
`GET /api/mcontent/static/images/slider/{fileName}`
где {fileName} - это `fileName`

## API отзывов

Запрос всех отзывов
`GET /api/mcontent/testimonial/public`

возвращает массив объектов:
```
{
  id: идентификатор слайда,
  name: имя,
  message: отзыв,
  company: компания (может быть пустой строкой),
  isPublic: булево значение,
  photo: {
    originalName: исходное имя файла,
    fileName: текущее имя файла,
  },
  createdAt: дата создания,
  updatedAt: дата обновления,
}
```

Получить фото
`GET /api/mcontent/static/images/testimonial/{fileName}`
где {fileName} - это `fileName`

## API получения прайса

Запрос всех данный прайса
`GET /api/mcontent/price/public`
возвращает объект
```
{
  fileName: имя файла,
  createdAt: дата создания
}
```

Скачать прайс
`GET /api/mcontent/static/price/{fileName}`
где {fileName} - это `fileName`


## API шаблонов страниц

Получить данные страницы
`GET /api/mcontent/template/public/{alias}`
где {alias} - это псевдоним страницы шаблона. Наприимер, `index` - это псевдоним файла `index.html`

Возвращаемый объект содержит данные для header блока шаблона.

## API контактных данных

Получить контактные данные
`GET /api/mcontent/contact/public`

## API блока "достижения"

Получить данные о достижениях
`GET /api/mcontent/progress/public/search`

## API блока "решения"

Получить данные о решениях
`GET /api/mcontent/solution/public/search`

## API сотрудников

Запрос всех сотрудников
`GET /api/mcontent/team/public`

возвращает массив объектов:
```
{
  id: идентификатор сотрудника,
  name: имя,
  position: должность (может быть пустой строкой),
  isPublic: булево значение,
  photo: {
    originalName: исходное имя файла,
    fileName: текущее имя файла,
  },
  createdAt: дата создания,
  updatedAt: дата обновления,
}
```

## API каталога

Запрос уровней каталога
`GET /api/mcontent/catalog/level/public`

возвращает массив объектов:
```
{
  id: идентификатор уровня,
  title: название,
  parent: null, id родительского уровня,
  createdAt: дата создания,
  updatedAt: дата обновления,
  childs: [ массив потомков
    {
      id: идентификатор уровня,
      title: название,
      parent: null, id родительского уровня,
      createdAt: дата создания,
      updatedAt: дата обновления,
      childs: [] массив потомков, 
    }
  ]
}
```

Запрос позиций каталога
`GET /api/mcontent/catalog/position/public`

возвращает массив объектов:
```
{
  id: идентификатор позиции,
  title: наименование,
  article: артикул,
  isPublic: булево значение,
  image: {
    originalName: исходное имя файла,
    fileName: текущее имя файла,
  },
  level: {
    id: идентификатор уровня,
    title: наименование уровня,
  },
  createdAt: дата создания,
  updatedAt: дата обновления,
}
```
