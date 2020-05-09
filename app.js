const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//--- Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// app.use(express.static(`${__dirname}/public`);

app.use((req, res, next) => {
  //We can make our own middleware func
  console.log('Hello from the middleware :) ');
  next(); //it is for a next middleware to be called.
});

app.use((req, res, next) => {
  req.currentRequestTime = new Date().toISOString();
  next();
});

//---- Routes

// Mounting a router! - it should be mounted after declaring variables.
app.use('/api/v1/users', userRouter); // we use 'api/v1/users' as a default route for userRouter (middleware function)
app.use('/api/v1/tours', tourRouter); // we use 'api/v1/tours' as a default route for tourRouter (middleware function)

module.exports = app;
