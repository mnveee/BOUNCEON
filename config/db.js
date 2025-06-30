const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
    })
    .then(() => {
      console.log("Connected to MongoDB successfully");
    });
}

module.exports = connectToDB;
