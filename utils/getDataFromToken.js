const jwt = require("jsonwebtoken");

function getDataFromToken(token) {
  try {
    const tokenData = jwt.verify(token, process.env.TOKEN_SECRET);

    return tokenData.id;
  } catch (error) {
    throw new Error("Token verification failed\n", error);
  }
}

module.exports = { getDataFromToken };
