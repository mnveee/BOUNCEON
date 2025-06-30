const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user.model");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("jobtitle").trim().notEmpty().withMessage("Job title is required"),
  body("company").trim().notEmpty().withMessage("Company is required"),
  // Validate the input fields for registration
  // Ensure that the username, job title, and company are not empty
  body("email").trim().isEmail(),
  body("password").trim().isLength({ min: 6 }),
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
      return res.status(400).json({
        errors: errors.array(),
        message: "Invalid input data",
      });
    }
    const { username, jobtitle, company, email, password, ConfirmPassword } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConfirmPassword = await bcrypt.hash(ConfirmPassword, 10);

    const newUser = await userModel.create({
      username,
      jobtitle,
      company,
      email,
      password: hashedPassword,
      ConfirmPassword: hashedConfirmPassword,
    });

    // user.save();
    res.redirect("/user/login");
    // Redirect to the login page after successful registration
    // This will allow the user to log in with their newly created account
    // The new user is created with the provided username, email, and hashed password
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
