import User from "./models/User.js";
import jwt from "jsonwebtoken";

// --- Helper: Generate JWT Token ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// --- Register User ---
export const registerUser = async (req, res) => {
  try {
    // 1. Debugging Log: See exactly what the frontend sent
    // Check your VS Code terminal when you click register. 
    // If phone/address are undefined here, the issue is in the Frontend/Context.
    console.log("Register Request Body:", req.body);

    // 2. Destructure ALL fields
    const { fullname, email, phone, address, password } = req.body;

    // 3. Validation: Ensure no fields are empty
    if (!fullname || !email || !phone || !address || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // 4. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 5. Create User
    // WE PASS RAW PASSWORD because your User.js model hashes it in .pre('save')
    const user = await User.create({
      fullname,
      email,
      phone,   // <--- FIX: explicitly passing phone
      address, // <--- FIX: explicitly passing address
      password,
    });

    // 6. Send Success Response
    if (user) {
      res.status(201).json({
        _id: user._id,
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
    // Return the actual error message so you can see it in the frontend alert
    res.status(500).json({ message: error.message });
  }
};

// --- Login User ---
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check password (using the method in your User model)
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
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