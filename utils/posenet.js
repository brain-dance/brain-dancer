require('@tensorflow/tfjs-node');
const posenet = require('@tensorflow-models/posenet');
const params = require('./videoJsOptions');

/**
 * Sets config for PoseNet and loads it up. For more info: https://github.com/tensorflow/tfjs-models/tree/master/posenet
 * @param {number} stride Specifies the output stride of the PoseNet model. The smaller the value, the larger the output resolution, and more accurate the model at the cost of speed. Set this to a larger value to increase speed at the cost of accuracy.
 */
const singlePoseNet = (stride = 16) => {
  let poseNetConfig = {
    algorithm: 'single-pose', //other option: multi-pose
    input: {
      architecture: 'MobileNetV1',
      outputStride: stride,
      inputResolution: {width: params.width, height: params.height},
      multiplier: 0.75,
      quantBytes: 2
    },
    singlePoseDetection: {
      minPoseConfidence: 0.1,
      minPartConfidence: 0.5
    },
    output: {
      showVideo: true,
      showPoints: true
    }
  };
  return posenet
    .load({
      architecture: poseNetConfig.input.architecture,
      outputStride: poseNetConfig.input.outputStride,
      inputResolution: poseNetConfig.input.inputResolution,
      multiplier: poseNetConfig.input.multiplier,
      quantBytes: poseNetConfig.input.quantBytes
    })
    .then(net => net);
};
module.exports.singlePoseNet = singlePoseNet;
//module.exports = {singlePoseNet};
