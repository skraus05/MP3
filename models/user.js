"use strict";
const { Model } = require("sequelize");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      highscore: {
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );

  /**
   * instanceMethods
   */
  User.prototype.correctPassword = function (candidatePwd) {
    //we need to compare the plain version to an encrypted version of the password
    return bcrypt.compare(candidatePwd, this.password);
  };

  User.prototype.generateToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT);
  };

  /**
   * classMethods
   */
  User.authenticate = async function ({ username, password }) {
    console.log('user', username)
    const user = await this.findOne({ where: { username } });
    if (!user || !(await user.correctPassword(password))) {
      const error = Error("Incorrect username/password");
      error.status = 401;
      throw error;
    }
    return user.generateToken();
  };

  User.findByToken = async function (token) {
    try {
      const { id } = await jwt.verify(token, process.env.JWT);
      const user = User.findByPk(id);
      if (!user) {
        throw "nooo";
      }
      return user;
    } catch (ex) {
      const error = Error("bad token");
      error.status = 401;
      throw error;
    }
  };

  /**
   * hooks
   */
  const hashPassword = async (user) => {
    //in case the password has been changed, we want to encrypt it with bcrypt
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
    }
  };

  User.beforeCreate(hashPassword);
  User.beforeUpdate(hashPassword);
  User.beforeBulkCreate((users) => Promise.all(users.map(hashPassword)));

  return User;
};
