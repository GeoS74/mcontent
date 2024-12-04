module.exports = (data) => ({
  id: data.id,
  name: data.name || '',
  position: data.position || '',
  isPublic: data.isPublic,
  photo: {
    originalName: data.photo.originalName,
    fileName: data.photo.fileName,
  },
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});
