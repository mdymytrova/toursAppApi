const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const handlerFactory = require("./handlerFactory");
const UserQueryBuilder = require("../query-builders/userQueryBuilder");

exports.getUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);

exports.getFilteredUsers = handlerFactory.getFilteredAll(
  User,
  UserQueryBuilder
);

// Update user info by admin
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);

// Update user info by current user
exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { firstName, lastName, email },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    next(new AppError(`No user found with ID ${req.params.id}`, 404));
    return;
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteCurrentUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  if (!user) {
    return next(new AppError(`No user found with ID ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getCurrentUser = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
