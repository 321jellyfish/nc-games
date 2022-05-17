const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviewsById,
  patchReviewVotes,
} = require("./controllers/reviews.controller");
const { getUsers } = require("./controllers/users.controller");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/users", getUsers);
app.patch("/api/reviews/:review_id", patchReviewVotes);

app.use("/*", (request, response, next) => {
  response.status(404).send({ msg: "Not Found" });
});

app.use((error, request, response, next) => {
  if (error.code === "22P02" || error.code === "23502") {
    response.status(400).send({ msg: "Bad Request" });
  } else if (response.status) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    response.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
