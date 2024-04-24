require("dotenv").config();
module.exports = {
  development: {
    username: "postgres",
    password: "Jal2f0rn!",
    database: "postgres",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {

  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
};
