const catchAsync = require("./../utils/catchAsync");
const Review = require("../models/reviewModel");
const handlerFactory = require("./handlerFactory");
const ReviewQueryBuilder = require("../query-builders/reviewQueryBuilder");

exports.getReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) {
    filter = {
      tour: req.params.tourId,
    };
  }
  const query = await Review.find(filter);
  const reviews = await query;

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getFilteredReviews = handlerFactory.getFilteredAll(
  Review,
  ReviewQueryBuilder
);

exports.getReview = handlerFactory.getOne(Review);
exports.addReview = handlerFactory.createOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);

// Middleware
exports.setTourAndUserId = (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }

  if (!req.body.user) {
    req.body.user = req.user.id;
  }

  next();
};
