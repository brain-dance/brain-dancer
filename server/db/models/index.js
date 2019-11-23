const User = require('./user');
const Team = require('./team');
const UserTeam = require('./UserTeam');
const CalibrationFrame = require('./calibrationframe');
const VideoFrame = require('./videoframe');
const Routine = require('./routine');
const Practice = require('./practice');
const Assignment = require('./assignment');

//Assignment
User.hasMany(Assignment);
Assignment.belongsTo(Routine); //and therefore one choreographer

//Team
User.belongsToMany(Team, {through: UserTeam});
Team.belongsToMany(User, {through: UserTeam});
Team.hasMany(Routine);

//Routine
Routine.belongsTo(User); //choreographer
Routine.belongsTo(Team);
Routine.hasMany(VideoFrame);
Routine.hasOne(CalibrationFrame);

//Practice
Practice.belongsTo(User); //dancer
Practice.belongsTo(Routine);
Practice.hasMany(VideoFrame);
Practice.hasOne(CalibrationFrame);

module.exports = {
  Routine,
  Practice,
  VideoFrame,
  UserTeam,
  Team,
  CalibrationFrame,
  User
};
