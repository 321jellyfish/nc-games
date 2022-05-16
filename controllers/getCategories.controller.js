const { selectCategories } = require("../models/getCategories.model");

exports.getCategories = (request, response) => {
  selectCategories().then((categories) => {
    response.status(200).send({ categories });
  });
};
