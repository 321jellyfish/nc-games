const { selectCategories } = require("../models/getCategories.model");

exports.getCategories = () => {
  console.log("hello from controller");
  selectCategories();
};
