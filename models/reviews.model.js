const db = require("../db/connection");
const categories = require("../db/data/test-data/categories");

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

exports.fetchReviews = (sortBy = "created_at", orderBy = "desc", category) => {
  if (!["asc", "desc"].includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }
  if (
    !["votes", "created_at", "title", "owner", "category", "designer"].includes(
      sortBy
    )
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  let queryStr = `SELECT   u.username AS owner, r.title, r.review_id, r.category, r.review_img_url, r.created_at, r.votes, r.designer, (SELECT COUNT(c.comment_id)::int AS comment_count FROM comments AS c)
  FROM        reviews AS r
  LEFT JOIN   users AS u
  ON          r.owner = u.username`;

  //if no category just do sort by and order
  if (!category) {
    queryStr += ` ORDER BY r.${sortBy} ${orderBy}`;
    return db.query(queryStr).then((result) => {
      return result.rows;
    });
  }

  //deal with categories
  if (category) {
    const categoryGreenList = [];
    return db.query(`SELECT slug FROM categories`).then((result) => {
      result.rows.forEach((category) => {
        categoryGreenList.push(category.slug);
      });
      //deal with categories that contain 's
      if (categoryGreenList.includes(category)) {
        const regex = /'/;
        if (regex.test(category)) {
          category = category.replace(regex, "''");
        }
        //build rest of query string
        queryStr += ` WHERE r.category = '${category}'`;
        queryStr += ` ORDER BY r.${sortBy} ${orderBy}`;
        return db.query(queryStr).then((result) => {
          return result.rows;
        });
      } else {
        return Promise.reject({ status: 404, msg: "Invalid category query" });
      }
    });
  }
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
