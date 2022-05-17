const { selectUsers } = require("../models/users.model");

exports.getUsers = () => {
  console.log("controller");
  selectUsers();
};
