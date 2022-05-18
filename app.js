const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviewsById,
  patchReviewVotes,
  getReviews,
  getComments,
  postComment,
} = require("./controllers/reviews.controller");
const { getUsers } = require("./controllers/users.controller");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews/:review_id/comments", getComments);
app.get("/api/reviews", getReviews);
app.post("/api/reviews/:review_id/comments", postComment);
app.get("/api/users", getUsers);
app.patch("/api/reviews/:review_id", patchReviewVotes);

app.use("/*", (request, response, next) => {
  response.status(404).send({ msg: "Hello Not Found" });
});

app.use((error, request, response, next) => {
  // console.log(error);
  if (error.code === "22P02" || error.code === "23502") {
    response.status(400).send({ msg: "Bad Request" });
  } else if (error.code === "23503") {
    response.status(404).send({ msg: "User Not Found" });
  } else if (response.status) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    response.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
