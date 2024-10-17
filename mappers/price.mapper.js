module.exports = (data) => ({
  price: {
    originalName: data.image.originalName,
    fileName: data.image.fileName,
  },
  createdAt: data.createdAt
});
