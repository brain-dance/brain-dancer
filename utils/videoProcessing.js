const extractFrames = require('ffmpeg-extract-frames');
const {canvasify} = require('../backUtils/canvasify');
const {singlePoseNet} = require('./posenet');
const fs = require('fs');
const glob = require('glob');

/* ********************
  This file includes functions involved in processing an uploaded video prior to
  sending it to our database.
  ******************** */

/**
   * takes the video and passes it through ffmpeg to extract all the
  frames, saving them in the ./utils folder.
   * @param {string} videoPath
   */
const generateFrames = async videoPath => {
  await extractFrames({
    input: videoPath,
    output: './utils/frame-%d.jpg'
  });
};

/**
 * After the processing is done, removeFrames removes the frame jpg files that were originally generated
    in the ./utils folder.
 * @param {array} frameList
 */
const removeFrames = frameList => {
  frameList.forEach(frame => {
    fs.unlinkSync(frame);
  });
};

/**
 * generateWireframes takes these files, canvasifies them (using a utility
    function, generates a temporary canvas, draws the image file, and returns),
    and then passes the canvas through PoseNet. These results are saved in
    sequential order in the wireframes [] array.
 * @param {string} videoPath
 */
const generateWireframes = async videoPath => {
  const net = await singlePoseNet();
  await generateFrames(videoPath);
  console.log('done generating frames');

  const frameList = await glob.sync('./utils/frame*');

  const wireframes = [];

  let i = 0;
  while (i < frameList.length) {
    const canvas = await canvasify(frameList[i]);

    const wireframe = await net.estimateSinglePose(canvas, {
      flipHorizontal: false
    });
    wireframes.push(wireframe);

    i++;
  }

  removeFrames(frameList);

  return wireframes;
};

module.exports = {generateWireframes};
