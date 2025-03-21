module.exports = (data) => ({
  id: data.id,
  alias: data.alias,
  title: data.title,
  article: data.article || '',
  description: data.description || '',
  isPublic: data.isPublic,
  files: {
    image: {
      originalName: data.image.originalName,
      fileName: data.image.fileName,
    },
    pdf: {
      originalName: data.pdf.originalName,
      fileName: data.pdf.fileName,
    },
  },
  level: {
    id: data.level.id,
    alias: data.level.alias,
    title: data.level.title,
  },
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});
