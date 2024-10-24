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

Получить слайд
`GET /api/mcontent/static/images/slider/{fileName}`
где {fileName} - это `fileName`

## API отзывов

Запрос всех слайдов
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