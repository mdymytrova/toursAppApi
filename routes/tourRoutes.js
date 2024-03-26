const express = require("express");

const router = express.Router();
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const {
  getTours,
  getAllTours,
  addTour,
  updateTour,
  deleteTour,
  getTourById,
  getTopTours,
  getTourStats,
  getMonthlyPlan,
} = tourController;
const { protect } = authController;

router.route("/").get(protect, getTours).post(addTour);
router.route("/top").post(getTopTours, getAllTours);
router.route("/stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/all").post(getAllTours);
router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
