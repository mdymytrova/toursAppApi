const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getFilteredUsers,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
} = require("./../controllers/userController");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

router.use(protect);

router.patch("/update-password", updatePassword);
router
  .route("/me")
  .get(getCurrentUser, getUser)
  .patch(updateCurrentUser)
  .delete(deleteCurrentUser);

router.use(restrictTo("admin"));

router.route("/").get(getUsers);
router.route("/users-filter").post(getFilteredUsers);

router
  .route("/:id")
  .get(getUser)
  .patch(restrictTo("admin"), updateUser)
  .delete(restrictTo("admin"), deleteUser);

module.exports = router;
