const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
  },
  jobtitle: {
    type: String,
    // required: true,
    trim: true,
  },
  company: {
    type: String,
    // required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const user = mongoose.model("user", userSchema);
module.exports = user;
// This code defines a Mongoose schema and model for a user in a MongoDB database.
