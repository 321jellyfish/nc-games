const {
  fetchReviewsById,
  updateReviewVotes,
  fetchReviews,
  fetchComments,
  writeComment,
} = require("../models/reviews.model");

exports.getReviewsById = (request, response, next) => {
  const { review_id: reviewId } = request.params;
  fetchReviewsById(reviewId)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewVotes = (request, response, next) => {
  const { review_id: reviewId } = request.params;
  const { inc_votes: voteNumber } = request.body;

  updateReviewVotes(reviewId, voteNumber)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviews = (request, response, next) => {
  fetchReviews().then((reviews) => {
    response.status(200).send({ reviews });
  });
};

exports.getComments = (request, response, next) => {
  const { review_id: reviewId } = request.params;
  fetchComments(reviewId)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch(next);
};

exports.postComment = (request, response, next) => {
  console.log("controller");
  writeComment().then((comment) => {
    response.status(201).send({ comment });
  });
};
