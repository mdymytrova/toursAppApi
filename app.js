const express = require("express");
const app = express();

const baseUrl = "/api/v1";
const tourRouter = require("./routes/tourRoutes");

// middleware
app.use(express.json());
app.use(`${baseUrl}/tours`, tourRouter);

module.exports = app;
