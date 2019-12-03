const {singlePoseNet} = require('../utils/posenet');

const getPose = async input => {
  const net = await singlePoseNet();
  return net.estimateSinglePose(input, {
    flipHorizontal: true
  });
};

/*const isBrowser=()=>{
  console.log("IN IS BROWSER, this context is: ", this);
  return this===this.window
}*/
// console.log("In module, this is: ", this);
// (()=>{
//   if(!(this===this.window)){
//     console.log(this);
//     console.log("HYPOTHESIS: THINGS ARE BEING RUN ?")
const {createCanvas, loadImage} = require('canvas');
const sizeOf = require('image-size');

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
//   }
// })()

module.exports.getPose = getPose;
