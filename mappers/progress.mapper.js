module.exports = (data) => ({
  id: data.id,
  title: data.title,
  message: data.message || '',
  cssClass: data.cssClass || '',
  isPublic: data.isPublic,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});
