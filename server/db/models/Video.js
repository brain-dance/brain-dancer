const Sequelize = require('sequelize');
const db = require('../db');

const Video = db.define('video', {
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isUrl: true
    }
  },
  status: {
    type: Sequelize.ENUM(['performance', 'practice']),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

module.exports = Video;
