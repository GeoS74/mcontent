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
`GET /api/mcontent/static/images/slider/{filename}`
где {filename} - это `fileName`

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
`GET /api/mcontent/static/images/testimonial/{filename}`
где {filename} - это `fileName`

## Получить список шаблонов

`GET /api/mcontent/template/pages`