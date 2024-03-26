const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res, next) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const getCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const getValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((validationError) => validationError.message)
    .join(". ");
  const message = `Invalid data: ${errors}`;
  return new AppError(message, 400);
};

const getDulicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}; please use another value`;
  return new AppError(message, 400);
};

const sendErrorProd = (err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR: ", err);
    res.status(500).json({
      status: err.status,
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res, next);
  } else if (process.env.NODE_ENV === "production") {
    let displayedError = { ...err };

    if (err.name === "CastError") {
      displayedError = getCastErrorDB(err);
    }
    if (err.name === "ValidationError") {
      displayedError = getValidationErrorDB(err);
    }
    if (err.code === 11000) {
      displayedError = getDulicateErrorDB(err);
    }
    sendErrorProd(displayedError, req, res, next);
  }
};
