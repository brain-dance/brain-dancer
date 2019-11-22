const Sequelize = require('sequelize');
const db = require('../db');

//Note - might be better to just have a pile of fields here.
//Note: currently, timestamps are assuming an integer number of milliseconds.
//That could very easily be incorrect, but is pretty trivial to change.
const VideoFrame = db.define('videoframe', {
  framejson: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
    ///CAN RESTORE IF WE ARE USING JSONs; FOR NOW, USING STRINGS
    // get: function() {
    //   // console.log('Data Value:', this.getDataValue('framejson'));
    //   return JSON.parse(this.getDataValue('framejson'));
    // },
    // set: function(obj) {
    //   console.log('DATAVALUE IN SET: ', obj);
    //   this.setDataValue('framejson', JSON.stringify(obj));
    // }
  },

  frameNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10000
    }
  }
});

module.exports = VideoFrame;
