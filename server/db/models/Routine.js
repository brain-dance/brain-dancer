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

Routine.beforeCreate(function(routine) {
  routine.title =
    routine.title.slice(0, 1).toUpperCase() + routine.title.slice(1);
});

module.exports = Routine;
