const User = require('./user');
const Team = require('./team');
const CalibrationFrame = require('./calibrationframe');
const Video = require('./video');
const VideoFrame = require('./videoframe');

//Q. Do we want Team has many users?
Team.belongsToMany(User, {through: 'userteams'});
Team.hasMany(Video);

Video.belongsTo(User);
Video.hasMany(VideoFrame);
Video.hasOne(CalibrationFrame);

//Q. Should we add that user has many vidoes?
//Q. Does the user have calibration measurements?

module.exports = {
  Video,
  VideoFrame,
  Team,
  CalibrationFrame,
  User
};
