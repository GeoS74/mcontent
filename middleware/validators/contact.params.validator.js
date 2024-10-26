module.exports.alias = async (ctx, next) => {
  ctx.params.alias = _checkText(ctx.params.alias);
  await next();
};

module.exports.value = async (ctx, next) => {
  ctx.request.body.description = _checkText(ctx.request?.body?.value) || '';
  await next();
};

function _checkText(text) {
  return text?.trim();
}
