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