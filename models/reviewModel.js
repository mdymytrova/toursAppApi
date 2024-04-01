const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
      required: [true, "Please rate the tour"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must be attached to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must be attached to a user"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "user",
      select: "firstName lastName username",
    },
  ]);
  next();
});

reviewSchema.statics.calcRatingAvg = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        ratingQty: { $sum: 1 },
        ratingAvg: { $avg: "$rating" },
      },
    },
  ]);

  if (stats?.length) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingAvg: stats[0].ratingAvg,
      ratingQty: stats[0].ratingQty,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingAvg: 0,
      ratingQty: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcRatingAvg(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  this.r.constructor.calcRatingAvg(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
