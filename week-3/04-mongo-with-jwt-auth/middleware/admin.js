const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

// Middleware for handling auth
function adminMiddleware(req, res, next) {
  const auth = req.get("Authorization");
  if (!auth) {
    res.sendStatus(401);
    return;
  }
  const words = auth.split(" "); // ["Bearer", "token"]
  const token = words[1]; // Trimming whitespace
  // now we need to verify this token
  try {
    jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
}

module.exports = adminMiddleware;
