"use strict";

const { Model } = require("sequelize");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    // Instance methods
    correctPassword(candidatePwd) {
      // Compare the plain version to an encrypted version of the password
      return bcrypt.compare(candidatePwd, this.password);
    }

    generateToken() {
      return jwt.sign({ id: this.id }, process.env.JWT);
    }

    // Class methods
    static async authenticate({ username, password }) {
      console.log('user', username);
      const user = await this.findOne({ where: { username } });
      if (!user || !(await user.correctPassword(password))) {
        const error = new Error("Incorrect username/password");
        error.status = 401;
        throw error;
      }
      return user.generateToken();
    }

    static async findByToken(token) {
      try {
        const { id } = await jwt.verify(token, process.env.JWT);
        const user = await this.findByPk(id);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (ex) {
        const error = new Error("Bad token");
        error.status = 401;
        throw error;
      }
    }

    // Set the high score for a user if the new score is higher than the current high score.
    static async setHighScore(userId, score) {
      // Find the user by ID
      const user = await this.findByPk(userId);
      if (!user) {
        throw new Error('User with the specified ID not found');
      }

      // Check if the new score is higher than the current high score
      if (!user.highscore || score > user.highscore) {
        // Set the new high score and save the user
        user.highscore = score;
        await user.save();
        return user;
      } else {
        // If the new score is not higher, do not update and just return the user
        return user;
      }
    }
  }

  // Initialize the model
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    highscore: {
      type: DataTypes.INTEGER,
      allowNull: true, // allows null if no high score has been recorded yet
      defaultValue: 0 // or set a default value if you prefer
    }
  }, {
    sequelize,
    modelName: "User",
    tableName: "users"
  });

  // Hooks
  const hashPassword = async (user) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(10));
    }
  };

  User.beforeCreate(hashPassword);
  User.beforeUpdate(hashPassword);
  User.beforeBulkCreate(users => Promise.all(users.map(hashPassword)));

  return User;
};
