const express = require("express");

const router = express.Router();
const {
  getTours,
  getFilteredTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
  getTopTours,
  getTourStats,
  getMonthlyPlan,
} = require("./../controllers/tourController");
const { protect, restrictTo } = require("./../controllers/authController");
const reviewRouter = require("./reviewRoutes");

// Nested routes
router.use("/:tourId/reviews", reviewRouter);

router
  .route("/")
  .get(getTours)
  .post(protect, restrictTo("admin", "lead-guide"), addTour);

router.route("/tours-filter").post(getFilteredTours);
router.route("/top").post(getTopTours, getFilteredTours);
router.route("/stats").get(getTourStats);
router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);

router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
