module.exports = (data) => ({
  name: data.name,
  tplFileName: data.tplFileName,
  alias: data.alias,
  title: data.title || '',
  description: data.description || '',
  meta: {
    title: data.meta.title || '',
    description: data.meta.description || '',
  },
});
