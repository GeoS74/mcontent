module.exports = (data) => ({
  id: data.id,
  name: data.name,
  message: data.message,
  company: data.company || '',
  isPublic: data.isPublic,
  photo: {
    originalName: data.photo.originalName,
    fileName: data.photo.fileName,
  },
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});
