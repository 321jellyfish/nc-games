const { fetchReviewsById } = require("../models/getReviewsById.model");

exports.getReviewsById = (request, response, next) => {
  const reviewId = request.params.review_id;
  fetchReviewsById(reviewId)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch(next);
};
