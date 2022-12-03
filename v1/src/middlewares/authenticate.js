const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null)
    return res.sendStatus(httpStatus.UNAUTHORIZED).send({
      message: "first go to login page",
    });

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err)
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ error: { message: err.message || " token is not valid" } });
    req.user = user?._doc;
    next();
  });
};
module.exports = authenticateToken;
