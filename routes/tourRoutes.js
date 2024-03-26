const express = require("express");

const router = express.Router();
const tourController = require("./../controllers/tourController");
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

router.route("/").get(getTours).post(addTour);
router.route("/top").post(getTopTours, getAllTours);
router.route("/stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/all").post(getAllTours);
router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
