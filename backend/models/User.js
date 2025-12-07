import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Counter from "./Counter.js";

const userSchema = new mongoose.Schema(
  {
    userID: { type: Number, unique: true },

    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["adopter", "admin"],
      default: "adopter",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const user = this;

  if (user.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "userID" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    user.userID = counter.seq;
  }
  
  if (!user.isModified("password")) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;