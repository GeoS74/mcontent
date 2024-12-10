const Koa = require('koa');
const cors = require('@koa/cors');

const config = require('./config');
const errorCatcher = require('./middleware/error.catcher');
const userRoutes = require('./routes/user.routes');
const sliderRoutes = require('./routes/slider.routes');
const templatePageRoutes = require('./routes/templatePage.routes');
const testimonialRoutes = require('./routes/testimonial.routes');
const priceRoutes = require('./routes/price.routes');
const contactRoutes = require('./routes/contact.routes');
const progressRoutes = require('./routes/progress.routes');
const solutionRoutes = require('./routes/solution.routes');
const teamRoutes = require('./routes/team.routes');
const noteRoutes = require('./routes/note.routes');
const levelCatalogRoutes = require('./routes/level.catalog.routes');
const positionCatalogRoutes = require('./routes/position.catalog.routes');

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

app.use(testimonialRoutes.publicRoutes);
app.use(testimonialRoutes.routes);
app.use(testimonialRoutes.static);

app.use(priceRoutes.publicRoutes);
app.use(priceRoutes.routes);
app.use(priceRoutes.static);

app.use(templatePageRoutes.publicRoutes);
app.use(templatePageRoutes.routes);

app.use(contactRoutes.publicRoutes);
app.use(contactRoutes.routes);

app.use(progressRoutes.publicRoutes);
app.use(progressRoutes.routes);

app.use(solutionRoutes.publicRoutes);
app.use(solutionRoutes.routes);

app.use(teamRoutes.publicRoutes);
app.use(teamRoutes.routes);
app.use(teamRoutes.static);

app.use(noteRoutes.publicRoutes);
app.use(noteRoutes.routes);
app.use(noteRoutes.static);

app.use(levelCatalogRoutes.publicRoutes);
app.use(levelCatalogRoutes.routes);

app.use(positionCatalogRoutes.publicRoutes);
app.use(positionCatalogRoutes.routes);
app.use(positionCatalogRoutes.static);

module.exports = app;
