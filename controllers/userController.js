const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const query = await User.find();
  const users = await query;

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

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
