const posenet = require('@tensorflow-models/posenet');

const singlePoseNet = (stride = 16) => {
  let poseNetConfig = {
    algorithm: 'single-pose', //other option: multi-pose
    input: {
      architecture: 'MobileNetV1',
      outputStride: stride,
      inputResolution: {width: 640, height: 360},
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

module.exports = {singlePoseNet};
