const {
  fetchReviewsById,
  updateReviewVotes,
} = require("../models/reviews.model");

exports.getReviewsById = (request, response, next) => {
  const reviewId = request.params.review_id;
  fetchReviewsById(reviewId)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewVotes = (request, response, next) => {
  const reviewId = request.params.review_id;
  const voteNumber = request.body.inc_votes;
  updateReviewVotes(reviewId, voteNumber).then((review) => {
    response.status(200).send({ review });
  });
};
