const extractFrames = require('ffmpeg-extract-frames');
const {canvasify, getPose} = require('./formatting');
const {singlePoseNet} = require('./posenet');

const fs = require('fs');
const glob = require('glob');

const generateFrames = async videoPath => {
  await extractFrames({
    input: videoPath,
    output: './utils/frame-%d.jpg'
  });
};

const removeFrames = frameList => {
  frameList.forEach(frame => {
    fs.unlinkSync(frame);
  });
};

const generateWireframes = async videoPath => {
  const net = await singlePoseNet();
  await generateFrames(videoPath);

  const frameList = await glob.sync('./utils/frame*');
  const lst = [frameList[0], frameList[1], frameList[2]];
  const poses = await Promise.all(
    lst.map(frame => {
      return canvasify(frame).then(canvas =>
        net
          .estimateSinglePose(canvas, {
            flipHorizontal: true
          })
          .then(pose => pose)
      );
    })
  );

  removeFrames(frameList);

  console.log(poses);
};

const helper = async () => {
  const frameList = await glob.sync('./utils/frame*');

  removeFrames(frameList);
};

helper();

// generateWireframes('./utils/boop.mp4');
module.exports = {generateWireframes};
