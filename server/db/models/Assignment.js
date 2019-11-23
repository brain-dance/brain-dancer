const Sequelize = require('sequelize');
const db = require('../db');

const Assignment = db.define('assignment', {
  completed: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = Assignment;
