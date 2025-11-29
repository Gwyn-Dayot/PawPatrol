import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },

    // USER ROLE
    role: {
      type: String,
      enum: ["adopter", "staff", "admin", "vet"],
      default: "adopter",
    },

    // RESET PASSWORD FIELDS
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// --------------------- Hash password before saving ---------------------
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --------------------- Compare passwords ---------------------
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --------------------- Generate reset password token ---------------------
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 MINUTES

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;