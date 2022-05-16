const express = require("express");
const { getCategories } = require("./controllers/getCategories.controller");
const { getReviewsById } = require("./controllers/getReviewsById.controller");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);

app.use("/*", (request, response, next) => {
  response.status(404).send({ msg: "Not Found" });
});

app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  }
  if (response.status) {
    response.status(error.status).send({ msg: error.msg });
  }
});

module.exports = app;
