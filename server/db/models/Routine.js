const Sequelize = require('sequelize');
const db = require('../db');

const Routine = db.define('routine', {
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
  }
});

module.exports = Routine;
