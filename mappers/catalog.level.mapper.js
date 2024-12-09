module.exports = function mapper(data) {
  return {
    id: data.id,
    title: data.title,
    parent: data.parent || null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    childs: data?.childs?.map((childs) => mapper(childs)) || [],
  };
};
