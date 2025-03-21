const logger = require('../libs/logger');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error.status) {
      ctx.status = error.status;
      ctx.body = {
        error: error.message,
      };
      return;
    }

    // errors mongoDB
    if (error.name) {
      ctx.status = 400;
      switch (error.name) {
        case 'CastError': // value does not match model type
          if (error.message.indexOf('path "deadLine"') !== -1) {
            ctx.body = { error: 'invalid deadLine' };
            return;
          }
          if (error.message.indexOf('path "sum"') !== -1) {
            ctx.body = { error: 'invalid sum' };
            return;
          }
          break;
        case 'TypeError':
        case 'ValidationError':
          ctx.body = { error: error.message };
          return;
        case 'MongoServerError':
          if (error.code === 11000) {
            ctx.body = { error: 'value not unique' };
            return;
          }
          break;
        default:
      }
    }

    logger.error(error.message);

    ctx.status = 500;
    ctx.body = {
      error: 'internal server error',
    };
  }
};
