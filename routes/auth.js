const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  console.log(req.body);

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new User({ name, email, password, phoneNumber });
    await newUser.save();
    const token = jwt.sign(
      {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
      process.env.JWT_SECRET
    );
    res.json({ token, message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user information
router.put("/update", async (req, res) => {
  const { id, name, email, password, phoneNumber } = req.body;

  try {
    const user = await User.findById(id); // Get the authenticated user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Password will be hashed in the User model
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      process.env.JWT_SECRET
    );
    res.json({ token, message: "User information updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete("/delete", async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findByIdAndDelete(id); // Delete the authenticated user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot password
router.put("/forgot-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password) user.password = password;
    await user.save();

    res.json({ message: "Password sucessfully updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
