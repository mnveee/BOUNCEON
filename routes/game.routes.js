const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

router.get("/game", authMiddleware, (req, res) => {
  // Render the game page
  res.render("game");
});

module.exports = router;
