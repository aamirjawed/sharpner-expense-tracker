const path = require("path");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/node-mail");
const ForgotPassword = require("../model/forgotPasswordModel");
const { v4: uuidv4 } = require("uuid");

// Serve login page
const sendLoginHTML = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
};

// Login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in prod
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login success" });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// Serve signup page
const sendSignupHTML = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existedUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: createdUser,
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while registering the user",
    });
  }
};


const logoutUser = async(req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly:true,
      secure:false,
      sameSite:'strict'
    })

     return res.status(200).json({ 
      success:true,
      message: "Logged out successfully" 
    });

  } catch (error) {
     console.error("Error in logout user in user controller", error);
    return res.status(500).json({ 
      success:false,
      message: "Server error during logout" 
    });
  }
}

// My Profile
const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("fullName email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in myProfile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Premium or not
const premiumOrNot = async (req, res) => {
  if (req.isPremium === "Yes") {
    return res.json({ message: "yes" });
  } else {
    return res.json({ message: "no" });
  }
};

// Forgot password page
const forgotPasswordPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/forgotpassword.html"));
};

// Forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = uuidv4();

    await ForgotPassword.create({
      id: resetToken,
      userId: user._id,
      isActive: true,
    });

    const resetLink = `http://localhost:5000/user/password/reset-password/${resetToken}`;
    await sendEmail(normalizedEmail, resetLink);

    return res.status(200).json({ message: "Reset link sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    return res.status(500).json({ message: "Error in sending reset link" });
  }
};

// Reset password page
const resetPasswordPage = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await ForgotPassword.findOne({ id });

    if (request && request.isActive === true) {
      return res.sendFile(path.join(__dirname, "../public/resetpassword.html"));
    }

    return res.redirect("/forgot-password");
  } catch (error) {
    console.error("Error loading reset password page:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id } = req.params;

  try {
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const resetRequest = await ForgotPassword.findOne({ id });

    if (!resetRequest || resetRequest.isActive !== true) {
      return res
        .status(400)
        .json({ message: "Reset link is invalid or has expired." });
    }

    const user = await User.findById(resetRequest.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    resetRequest.isActive = false;
    await resetRequest.save();

    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    return res
      .status(500)
      .send("Something went wrong. Please try again later.");
  }
};

module.exports = {
  sendLoginHTML,
  sendSignupHTML,
  registerUser,
  userLogin,
  myProfile,
  premiumOrNot,
  forgotPasswordPage,
  forgotPassword,
  resetPasswordPage,
  resetPassword,
  logoutUser
};
