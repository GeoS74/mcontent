module.exports.alias = async (ctx, next) => {
  ctx.params.alias = _checkText(ctx.params.alias);
  await next();
};

module.exports.title = async (ctx, next) => {
  ctx.request.body.title = _checkText(ctx.request?.body?.title) || '';
  await next();
};

module.exports.description = async (ctx, next) => {
  ctx.request.body.description = _checkText(ctx.request?.body?.description) || '';
  await next();
};

module.exports.metaTitle = async (ctx, next) => {
  try {
    ctx.request.body.meta.title = _checkText(ctx.request?.body?.meta?.title) || '';
  } catch (error) {
    ctx.throw(400, 'field meta is empty');
  }
  await next();
};

module.exports.metaDescription = async (ctx, next) => {
  try {
    ctx.request.body.meta.description = _checkText(ctx.request?.body?.meta?.description) || '';
  } catch (error) {
    ctx.throw(400, 'field meta is empty');
  }
  await next();
};

function _checkText(text) {
  return text?.trim();
}
