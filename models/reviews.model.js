const db = require("../db/connection");

exports.fetchReviewsById = (reviewId) => {
  return db
    .query(
      `SELECT   r.*, COUNT(c.comment_id)::int AS comment_count
      FROM      reviews AS r
      LEFT JOIN comments AS c
      ON        c.review_id = r.review_id
      WHERE     r.review_id = $1
      GROUP BY  r.review_id`,
      [reviewId]
    )
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({ status: 404, msg: "Review Not Found" });
      }
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

exports.fetchReviews = (sortBy = "created_at") => {
  return db
    .query(
      `SELECT   u.username AS owner, r.title, r.review_id, r.category, r.review_img_url, r.created_at, r.votes, r.designer, (SELECT COUNT(c.comment_id)::int AS comment_count FROM comments AS c)
      FROM        reviews AS r
      LEFT JOIN   users AS u
      ON          r.owner = u.username
      ORDER BY    r.${sortBy}
      DESC
  `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchComments = (reviewId) => {
  return db
    .query(
      `SELECT *
    FROM reviews
    WHERE review_id = $1`,
      [reviewId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review Not Found" });
      }
      return db.query(
        `SELECT *
          FROM comments
          WHERE review_id = $1`,
        [reviewId]
      );
    })
    .then((result) => {
      return result.rows;
    });
};

exports.writeComment = (reviewId, username, commentBody) => {
  return db
    .query(
      `
    INSERT INTO comments (body, review_id, author)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
      [commentBody, reviewId, username]
    )
    .then((result) => {
      return result.rows[0];
    });
};
