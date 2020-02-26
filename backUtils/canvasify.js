const {singlePoseNet} = require('../utils/posenet');

/**
 * Takes an image input and runs it through the PoseNet model, returning a JSON object of the 17 body key points.
 * @param {canvas} input
 * @returns {json} object containing PoseNet's 17 body key points
 */
const getPose = async input => {
  const net = await singlePoseNet();
  return net.estimateSinglePose(input, {
    flipHorizontal: true
  });
};

const {createCanvas, loadImage} = require('canvas');
const sizeOf = require('image-size');

/**
 * Gets dimensions of the given image by calling sizeOf from the image-size npm package.
 * Creates a temporary canvas and context for a given image.
 * Returns a function that loads the image, draws image on the canvas, and returns the canvas.
 * <br/><br/>
 * This function is used in video processing on the back end, to generate a dance
  routine's skellies to be saved to the database.

 * @async
 * @param {string} imagePath file path to image in question
 * @returns a function that loads the image, draws image on the canvas, and returns the canvas
 */
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
