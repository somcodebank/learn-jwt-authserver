require("dotenv").config();
const express = require("express"),
  app = express();
const jwt = require("jsonwebtoken");
const users = require("./data/users.json");
app.use(express.json());

let tempRefreshTokens = [];

app.delete("/logout", (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) res.sendStatus(400);
  tempRefreshTokens = tempRefreshTokens.filter(
    (token) => token != refreshToken
  );
  res.sendStatus(204);
});

app.post("/token", (req, res, next) => {
  const { refreshToken } = req.body;
  if (!tempRefreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { username: user },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({ accessToken });
  });

  //   res.json({ refreshToken });
});

app.post("/login", (req, res, next) => {
  const { username } = req.body;
  //   console.log("req.body", { body: req.body });
  const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    }),
    refreshToken = jwt.sign(username, process.env.REFRESH_TOKEN_SECRET);

  if (!tempRefreshTokens.includes(refreshToken))
    tempRefreshTokens.push(refreshToken);
  //   console.log({ accessToken, username });
  res.json({ accessToken, refreshToken });
});

app.listen(3250, () => console.log("Auth Server - 3250"));
