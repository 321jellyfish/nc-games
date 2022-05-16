const express = require("express");
const { getCategories } = require("./controllers/getCategories.controller");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use("/*", (request, response, next) => {
  response.status(404).send({ msg: "Not Found" });
});

module.exports = app;
