const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//--- Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.currentRequestTime = new Date().toISOString();
  // console.log(req.headers);

  next();
});

// Mounting a router! - it should be mounted after declaring variables.
app.use('/api/v1/users', userRouter); // we use 'api/v1/users' as a default route for userRouter (middleware function)
app.use('/api/v1/tours', tourRouter); // we use 'api/v1/tours' as a default route for tourRouter (middleware function)

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  //next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
