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
  const { sort_by: sortBy } = request.query;
  const { order } = request.query;
  const { category } = request.query;
  fetchReviews(sortBy, order, category)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch(next);
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
  const { review_id: reviewId } = request.params;
  const { username, body: commentBody } = request.body;
  //rewrite to one promise - first promise unnecessary
  Promise.all([
    fetchReviewsById(reviewId),
    writeComment(reviewId, username, commentBody),
  ])
    .then(([, postedComment]) => {
      response.status(201).send({ postedComment });
    })
    .catch(next);
};
