import User from "./models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//Register User
export const registerUser = async (req, res) => {
  try {
    console.log("Register Request Body:", req.body);

    const { fullname, email, phone, address, password } = req.body;

    if (!fullname || !email || !phone || !address || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullname,
      email,
      phone,  
      address, 
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        displayId: user.displayId,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error); 

    res.status(500).json({ message: error.message });
  }
};

//Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        displayId: user.displayId,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password has been updated successfully" });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};