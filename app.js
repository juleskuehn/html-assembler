const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require('mongoose');
const auth = require('http-auth');

const app = express();

// Database connection
const mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1/html-assembler';
mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Express server configuration (see also /bin/www)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Simple authorization for edit routes
const basicAuth = auth.basic(
  { realm: "Editing requires login" },
  (user, pass, cb) => cb(user === "jules" && pass === "jules")
);

// THE IMPORTANT PART
// Associate routes
app.use('/', require('./routes/indexRoutes'));
app.use('/edit', auth.connect(basicAuth), require('./routes/editRoutes'));
app.use('/view', require('./routes/generatorRoutes'));

// Error handling
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;