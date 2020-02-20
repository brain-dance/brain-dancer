const {singlePoseNet} = require('../utils/posenet');

/* ********************
  getPose takes input (image) and runs it through the PoseNet model
  returns JSON object of 17 body key points
   ******************** */
const getPose = async input => {
  const net = await singlePoseNet();
  return net.estimateSinglePose(input, {
    flipHorizontal: true
  });
};

const {createCanvas, loadImage} = require('canvas');
const sizeOf = require('image-size');

/* ********************
  canvasify takes an image as input
  creates a canvas and context, and draws it on the canvas.
  This function is used in video processing on the back end, to generate a dance
  routine's skellies to be saved to the database.
   ******************** */
const canvasify = async imagePath => {
  const dim = sizeOf(imagePath);
  const canvas = await createCanvas(dim.width, dim.height);
  const ctx = await canvas.getContext('2d');
  return loadImage(imagePath).then(img => {
    ctx.drawImage(img, 0, 0);
    return canvas;
  });
};

module.exports.canvasify = canvasify;
module.exports.getPose = getPose;
