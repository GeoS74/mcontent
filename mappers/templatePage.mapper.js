module.exports = (data) => ({
  name: data.name,
  tplFileName: data.tplFileName,
  title: data.title || '',
  description: data.description || '',
});
