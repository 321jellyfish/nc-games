const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils.js");

exports.fetchReviewsById = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return result.rows[0];
    });
};
