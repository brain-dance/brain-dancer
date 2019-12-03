const Sequelize = require('sequelize');
const db = require('../db');

//Note - might be better to just have a pile of fields here.
const CalibrationFrame = db.define('calibrationframe', {
  pose: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    get: function() {
      return JSON.parse(this.getDataValue('pose'));
    },
    set: function(obj) {
      this.setDataValue('pose', JSON.stringify(obj));
    }
  }
});

module.exports = CalibrationFrame;
