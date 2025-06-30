const express = require("express");
const app = express();
const userRouter = require("./routes/user.routes");
const dotenv = require("dotenv");
dotenv.config();
const connectToDB = require("./config/db");
connectToDB(); // Connect to the database
const cookieParser = require("cookie-parser");
const gameRouter = require("./routes/game.routes");
const landingRouter = require("./routes/landing.route");

app.set("view engine", "ejs");
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use("/", landingRouter); // This line mounts the landing router on the root path
app.use("/game", gameRouter); // This line mounts the game router on the /game path
app.use("/user", userRouter); // This line mounts the user router on the /user path

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
