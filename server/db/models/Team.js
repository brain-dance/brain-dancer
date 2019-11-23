const Sequelize = require('sequelize');
const db = require('../db');

const Team = db.define('team', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: Sequelize.STRING
  },
  category: {
    type: Sequelize.STRING
  },
  imgUrl: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    },
    defaultValue:
      'https://irp-cdn.multiscreensite.com/ed519a01/dms3rep/multi/mobile/Lorraine_Steward_IMG_0935-256px-256x256.jpg'
  }
});

module.exports = Team;
