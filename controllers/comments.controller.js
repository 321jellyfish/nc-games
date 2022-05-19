const { deleteComment } = require("../models/comments.model");

exports.deleteCommentById = () => {
  console.log("controller");
  deleteComment();
};
