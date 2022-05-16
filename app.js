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

module.exports = app;
