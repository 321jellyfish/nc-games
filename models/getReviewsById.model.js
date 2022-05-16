const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils.js");

exports.fetchReviewsById = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
    .then((result) => {
      return result.rows[0];
    });
};
