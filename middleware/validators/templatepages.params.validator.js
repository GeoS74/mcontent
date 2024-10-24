module.exports.alias = async (ctx, next) => {
  ctx.params.alias = `${_checkText(ctx.params.alias)}.html`;
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

function _checkText(text) {
  return text?.trim();
}
