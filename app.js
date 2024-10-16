const Koa = require('koa');
const cors = require('@koa/cors');

const config = require('./config');
const errorCatcher = require('./middleware/error.catcher');
const userRoutes = require('./routes/user.routes');
const sliderRoutes = require('./routes/slider.routes');

const app = new Koa();

app.use(errorCatcher);
if (config.node.env === 'dev') {
  app.use(cors());
}

app.use(userRoutes.routes);
app.use(userRoutes.static);
app.use(sliderRoutes.publicRoutes);
app.use(sliderRoutes.routes);
app.use(sliderRoutes.static);

module.exports = app;
