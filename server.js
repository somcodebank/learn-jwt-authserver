require("dotenv").config();

const express = require("express"),
  app = express(),
  products = require("./data/products.json");
const jwt = require("jsonwebtoken");
app.use(express.json());

const authenticate = (req, res, next) => {
  // headers: [("authentication": "Bearer (TOKEN)")];
  const authentication = req.headers["authentication"];
  console.log(authentication);
  const accessToken = authentication && authentication.split(" ")[1];
  if (!accessToken) res.sendStatus(401);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
app.get("/myproducts", authenticate, (req, res, next) => {
  const { user } = req;
  console.log("...", user);
  const results = products.filter((product) => product.owner == user.username);
  res.json(results);
});

app.listen(3200, () => console.log("Server - port 3200"));
