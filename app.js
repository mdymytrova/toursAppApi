const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const app = express();
const AppError = require("./utils/appError");
const ErrorHandler = require("./controllers/errorController");

const baseUrl = "/api/v1";
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// middleware
// Set security HTTP headers
app.use(helmet());

// Body parser => req.body
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Sanitization against NoSQL query injection, removes mondodb specific query chars from req.body, req.params
app.use(mongoSanitize());

app.use(`${baseUrl}/tours`, tourRouter);
app.use(`${baseUrl}/users`, userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot handle ${req.originalUrl}`, 404));
});

app.use(ErrorHandler);

module.exports = app;
