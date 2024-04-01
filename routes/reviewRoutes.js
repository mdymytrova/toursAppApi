const express = require("express");
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  setTourAndUserId,
  getFilteredReviews,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .get(getReviews)
  .post(restrictTo("user"), setTourAndUserId, addReview);

router.route("/review-filter").post(getFilteredReviews);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("admin", "user"), updateReview)
  .delete(restrictTo("admin", "user"), deleteReview);

module.exports = router;
