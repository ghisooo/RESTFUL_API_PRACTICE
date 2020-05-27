module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // "err=> next(err)"" can be simplified to "next"
    // catch(err=> next(err)) will pass the error into the next function. Error ends up in "globalErrorHandler"
  };
};
