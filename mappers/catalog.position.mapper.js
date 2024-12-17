module.exports = (data) => ({
  id: data.id,
  title: data.title,
  article: data.article || '',
  isPublic: data.isPublic,
  image: {
    originalName: data.image.originalName,
    fileName: data.image.fileName,
  },
  level: {
    id: data.level.id,
    title: data.level.title,
  },
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});
