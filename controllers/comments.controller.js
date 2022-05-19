const { deleteComment } = require("../models/comments.model");

exports.deleteCommentById = (request, response, next) => {
  const { comment_id: commentId } = request.params;
  deleteComment(commentId)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};
