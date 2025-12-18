const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({
      message: "Token is missing.",
    });
  }

  jwt.verify(token, secret, (err, decoded) => {
    console.log(err);
    if (err)
      return res.status(403).send({
        message: "Access Forbidden",
      });

    req.username = decoded.username;
    req.authorId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;
