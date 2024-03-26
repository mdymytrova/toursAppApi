const express = require("express");
const app = express();
const AppError = require("./utils/appError");
const ErrorHandler = require("./controllers/errorController");

const baseUrl = "/api/v1";
const tourRouter = require("./routes/tourRoutes");

// middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(`${baseUrl}/tours`, tourRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot handle ${req.originalUrl}`, 404));
});

app.use(ErrorHandler);

module.exports = app;
