const User = require('./user');
const Team = require('./team');
const CalibrationFrame = require('./calibrationframe');
const Video = require('./video');
const VideoFrame = require('./videoframe');

User.belongsToMany(Team, {through: 'userteams'});

Team.belongsToMany(User, {through: 'userteams'});
Team.hasMany(Video);

Video.belongsTo(User);
Video.belongsTo(Team);
Video.hasMany(VideoFrame);
Video.hasOne(CalibrationFrame);

module.exports = {
  Video,
  VideoFrame,
  Team,
  CalibrationFrame,
  User
};
