const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxlength: [40, "First name must have less than 40 characters"],
  },
  lastName: {
    type: String,
    maxlength: [40, "Last name must have less than 40 characters"],
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    maxlength: [40, "Username must have less than 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: {
      values: ["user", "guide", "lead-guide", "admin"],
      message: "A user must have correct role",
    },
    default: "user",
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  providedPassword,
  savedPassword
) {
  const isCorrect = await bcrypt.compare(providedPassword, savedPassword);
  return isCorrect;
};

userSchema.methods.changedAfterPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // token to send to client
  const resetToken = crypto.randomBytes(32).toString("hex");

  // encrypted token to store
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10min

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
