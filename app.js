const express = require("express");
const { getCategories } = require("./controllers/getCategories.controller");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
});

module.exports = app;
