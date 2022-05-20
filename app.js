const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  getReviewsById,
  patchReviewVotes,
  getReviews,
  getComments,
  postComment,
} = require("./controllers/reviews.controller");
const { getUsers } = require("./controllers/users.controller");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalServerError,
} = require("./error-handlers");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews/:review_id/comments", getComments);
app.get("/api/reviews", getReviews);
app.post("/api/reviews/:review_id/comments", postComment);
app.get("/api/users", getUsers);
app.patch("/api/reviews/:review_id", patchReviewVotes);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.use("/*", (request, response, next) => {
  response.status(404).send({ msg: "Not Found" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerError);

module.exports = app;
