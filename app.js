const express = require("express");
const app = express();

const baseUrl = "/api/v1";
const tourRouter = require("./routes/tourRoutes");

// middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(`${baseUrl}/tours`, tourRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot find ${req.originalUrl}`,
  });
  next();
});

module.exports = app;
