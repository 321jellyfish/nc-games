const db = require("../db/connection");

exports.fetchReviewsById = (reviewId) => {
  // return db
  //   .query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
  //   .then((result) => {
  //     if (result.rows.length === 0) {
  //       return Promise.reject({ status: 404, msg: "Review Not Found" });
  //     }
  //     return result.rows[0];
  //   });

  // return db
  //   .query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
  //   .then((result) => {
  //     return db.query(
  //       `SELECT COUNT(*) FROM comments AS c JOIN reviews AS r ON c.review_id = r.review_id GROUP BY c.review_id HAVING c.review_id = $1 `,
  //       [reviewId]
  //     );
  //   })
  //   .then((result) => {
  //     const { count: commentCount } = result.rows[0];
  //     console.log(commentCount);
  //   });
  let commentCount = 0;
  return db
    .query(
      `SELECT COUNT(*) FROM comments AS c JOIN reviews AS r ON c.review_id = r.review_id GROUP BY c.review_id HAVING c.review_id = $1 `,
      [reviewId]
    )
    .then((result) => {
      commentCount = +result.rows[0].count;
      return db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [
        reviewId,
      ]);
    })
    .then((result) => {
      result.rows[0]["comment_count"] = commentCount;
      return result.rows[0];
    });
};

exports.updateReviewVotes = (reviewId, voteNumber) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`,
      [voteNumber, reviewId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review Not Found" });
      }
      return result.rows[0];
    });
};
