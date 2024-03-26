const Tour = require("./../models/tourModel");
const TourQueryBuilder = require("./tourQueryBuilder");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getTours = catchAsync(async (req, res, next) => {
  const query = await Tour.find();
  const tours = await query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  const query = Tour.find();
  const documentsCount = await Tour.countDocuments();

  const queryBuilder = new TourQueryBuilder(query, req.body)
    .filter()
    .search()
    .select()
    .sort()
    .limit();

  const tours = await queryBuilder.query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    count: documentsCount,
    data: {
      tours,
    },
  });
});

exports.addTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    next(new AppError(`No tour found with ID ${req.params.id}`, 404));
    return;
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    next(new AppError(`No tour found with ID ${req.params.id}`, 404));
    return;
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    next(new AppError(`No tour found with ID ${req.params.id}`, 404));
    return;
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

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
