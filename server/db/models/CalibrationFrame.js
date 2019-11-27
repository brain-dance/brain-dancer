const Sequelize = require('sequelize');
const db = require('../db');

//Note - might be better to just have a pile of fields here.
const CalibrationFrame = db.define('calibrationframe', {
  framejson: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    get: function() {
      return JSON.parse(this.getDataValue('framejson'));
    },
    set: function(obj) {
      this.setDataValue('framejson', JSON.stringify(obj));
    }
  }
});

module.exports = CalibrationFrame;
