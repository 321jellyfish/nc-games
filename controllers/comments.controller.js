const { deleteComment } = require("../models/comments.model");

exports.deleteCommentById = (request, response, next) => {
  const { comment_id: commentId } = request.params;
  deleteComment(commentId).then(() => {
    response.sendStatus(204);
  });
};
