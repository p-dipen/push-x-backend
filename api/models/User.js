const Sequelize = require("sequelize");
const bcryptService = require("../services/bcrypt.service");

const sequelize = require("../../config/database");

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  }
};

const tableName = "users";

const User = sequelize.define(
  "User", {
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    firstname: {
      type: Sequelize.STRING
    },
    lastname: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    phonenumber: {
      type: Sequelize.STRING,
      unique: true
    },
    activation: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    token: {
      type: Sequelize.STRING
    }
  }, {
    hooks,
    tableName
  }
);

// eslint-disable-next-line
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = User;