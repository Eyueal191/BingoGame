import User from "../models/User.js";
import { generateToken, verifyToken } from "../utils/auth/jwt.js";
import { hashPassword, comparePassword } from "../utils/auth/hash.js";

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered",
        error: true,
        success: false,
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({
      message: "Registered Successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Server error during signup",
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: "Unregistered Email",
        error: true,
        success: false,
      });
    }

    const isPasswordCorrect = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect credentials",
        error: true,
        success: false,
      });
    }

    const token = generateToken(existingUser._id);

    return res.status(200).json({
      message: "Logged in successfully",
      success: true,
      error: false,
      user: existingUser,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Server error during login",
    });
  }
};

// CHECK AUTH
const checkAuth = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "User not registered",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Auth verified",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      message: err.message || "Internal Server Error",
    });
  }
};
export { signup, login, checkAuth };
