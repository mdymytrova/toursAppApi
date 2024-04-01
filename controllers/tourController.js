const Tour = require("./../models/tourModel");
const TourQueryBuilder = require("../query-builders/tourQueryBuilder");
const catchAsync = require("./../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.getTours = handlerFactory.getAll(Tour);
exports.getTour = handlerFactory.getOne(Tour, { path: "reviews" });
exports.addTour = handlerFactory.createOne(Tour);
exports.updateTour = handlerFactory.updateOne(Tour);
exports.deleteTour = handlerFactory.deleteOne(Tour);

exports.getFilteredTours = handlerFactory.getFilteredAll(
  Tour,
  TourQueryBuilder
);

// Stats
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $group: {
        _id: "$level",
        avgRating: { $avg: "$ratingAvg" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        numOfRatings: { $sum: "$ratingQty" },
        numOfTours: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numOfTours: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numOfTours: -1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

exports.getTopTours = (req, res, next) => {
  req.body.paging = {
    pageSize: 5,
    pageNumber: 1,
  };
  req.body.filter = {
    rating: { min: 4 },
  };
  next();
};
