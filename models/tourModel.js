const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      minlength: [5, "A tour name must have at least 5 characters"],
      maxlength: [40, "A tour name must have less than 40 characters"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a max group size"],
    },
    level: {
      type: String,
      required: [true, "A tour must have a level of difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "A level must be easy, medium, or difficult",
      },
    },
    ratingAvg: {
      type: Number,
      default: 0,
      minlength: [1, "A rating must be above 1.0"],
      maxlength: [5, "A rating must be below 5.0"],
    },
    ratingQty: {
      type: Number,
      default: 0,
    },
    price: { type: Number, required: [true, "A tour must have a price"] },
    discount: Number,
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    slug: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre("find", function (next) {
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
