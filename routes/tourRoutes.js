const express = require("express");

const router = express.Router();
const tourController = require("./../controllers/tourController");
const { getAllTours, addTour, getTourById } = tourController;

router.route("/").get(getAllTours).post(addTour);
router.route("/:id").get(getTourById);

module.exports = router;
