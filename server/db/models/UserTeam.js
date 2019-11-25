const Sequelize = require('sequelize');
const db = require('../db');

const UserTeam = db.define('userteams', {
  role: {
    type: Sequelize.ENUM(['choreographer', 'dancer']),
    defaultValue: 'dancer'
  }
});

module.exports = UserTeam;
