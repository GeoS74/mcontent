module.exports = (data) => ({
  id: data.id,
  alias: data.alias,
  title: data.title,
  message: data.message || '',
  isPublic: data.isPublic,
  image: {
    originalName: data.image.originalName,
    fileName: data.image.fileName,
  },
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});
