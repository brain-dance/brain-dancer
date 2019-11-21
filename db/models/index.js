const User=require('./user');
const Team=require('./team');
const CalibrationFrame=require('./calibrationframe');
const Video=require('./video');
const VideoFrame=require('./videoframe');

Video.hasMany(VideoFrame);
Video.belongsTo(User);
Team.belongsToMany(User, {through: 'userteams'});
Video.hasOne(CalibrationFrame);
Team.hasMany(Video);

module.exports={
    Video, VideoFrame, Team, CalibrationFrame, User
}