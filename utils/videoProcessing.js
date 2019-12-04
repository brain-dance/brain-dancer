const extractFrames = require('ffmpeg-extract-frames');
const {canvasify} = require('../backUtils/canvasify');
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
  console.log('done generating frames');

  const frameList = await glob.sync('./utils/frame*');

  const wireframes = [];

  let i = 0;
  while (i < frameList.length) {
    canvasify(frameList[i]).then(canvas => {
      net.estimateSinglePose(canvas, {flipHorizontal: true}).then(wireframe => {
        wireframes.push(wireframe);
      });
    });
  }

  removeFrames(frameList);

  return wireframes;
};

module.exports = {generateWireframes};
