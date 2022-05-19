exports.handlePSQLErrors = (error, request, response, next) => {
  if (error.code === "22P02" || error.code === "23502") {
    response.status(400).send({ msg: "Bad Request" });
  } else if (error.code === "23503") {
    response.status(404).send({ msg: "User Not Found" });
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  response.status(error.status).send({ msg: error.msg });
};

exports.handleInternalServerError = (error, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
};
