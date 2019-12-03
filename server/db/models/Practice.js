const Sequelize = require('sequelize');
const db = require('../db');

const Practice = db.define('practice', {
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isUrl: true
    }
  },
  title: {
    type: Sequelize.STRING
  },
  score: {type: Sequelize.INTEGER}
});

module.exports = Practice;
