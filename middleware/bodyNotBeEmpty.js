module.exports = async (ctx, next) => {
  if (!ctx.request.body) {
    ctx.throw(400, 'the body should not be empty');
  }
  await next();
};
