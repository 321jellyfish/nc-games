const db = require("../db/connection");

exports.fetchReviewsById = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review Not Found" });
      }
      return result.rows[0];
    });
};

exports.updateReviewVotes = (reviewId, voteNumber) => {
  return db
    .query(`UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *`, [
      5 + voteNumber,
      reviewId,
    ])
    .then((result) => {
      return result.rows[0];
    });
};