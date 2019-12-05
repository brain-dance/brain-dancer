const User = require('./User');
const Team = require('./Team');
const UserTeam = require('./UserTeam');
const CalibrationFrame = require('./CalibrationFrame');
const VideoFrame = require('./VideoFrame');
const Routine = require('./Routine');
const Practice = require('./Practice');
const Assignment = require('./Assignment');

//Assignment
User.hasMany(Assignment);
Assignment.belongsTo(Routine); //and therefore one choreographer
Assignment.belongsTo(User);

//Team
User.belongsToMany(Team, {through: UserTeam});
Team.belongsToMany(User, {through: UserTeam});
Team.hasMany(Routine);

//Routine
Routine.belongsTo(User); //choreographer
Routine.belongsTo(Team);
Routine.hasMany(VideoFrame);
Routine.hasOne(CalibrationFrame);
CalibrationFrame.belongsTo(Routine);
Routine.hasMany(Assignment);
Routine.hasMany(Practice);

//Practice
Practice.belongsTo(User); //dancer
Practice.belongsTo(Routine);
Practice.hasMany(VideoFrame);
Practice.hasOne(CalibrationFrame);
CalibrationFrame.belongsTo(Practice);

module.exports = {
  Routine,
  Practice,
  VideoFrame,
  UserTeam,
  Team,
  CalibrationFrame,
  User,
  Assignment
};
