const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("jobtitle").trim().notEmpty().withMessage("Job title is required"),
  body("company").trim().notEmpty().withMessage("Company is required"),
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("ConfirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res
        .status(400)
        .render("register", { error: errors.array()[0].msg });
    }
    const { username, jobtitle, company, email, password } = req.body;
    try {
      console.log("Register attempt:", { username, email });
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        jobtitle,
        company,
        email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      console.log("User saved:", savedUser);
      res.redirect("/user/login");
    } catch (err) {
      console.error("Signup error:", err);
      res
        .status(500)
        .render("register", {
          error: "Error registering user: " + err.message,
        });
    }
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  body("email").trim().isEmail(),
  body("password").trim().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Invalid input data",
      });
    }
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Email is incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      // Sign the JWT with the user's ID, email, and username
      // using the secret key from environment variables
      // This token will be used for authentication in protected routes
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token);
    res.redirect("/game/game");
    // res.send("Logged in");
  }
);
module.exports = router;
// This code defines a simple Express router for user-related routes.
