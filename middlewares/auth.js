const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    return next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized" });
  }
}

module.exports = auth; // Export the auth middleware function
