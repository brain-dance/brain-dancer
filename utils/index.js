const posenet = require('@tensorflow-models/posenet');
const {createCanvas, loadImage} = require('canvas');
const path = require('path');

const singlePoseNet = () => {
  let poseNetConfig = {
    algorithm: 'single-pose', //other option: multi-pose
    input: {
      architecture: 'MobileNetV1',
      outputStride: 16,
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

const getPose = async input => {
  const net = await singlePoseNet();
  return net.estimateSinglePose(input, {
    flipHorizontal: true
  });
};

const canvasify = async (imagePath, width = 600, height = 400) => {
  const canvas = await createCanvas(width, height);
  const ctx = await canvas.getContext('2d');
  return loadImage(imagePath).then(img => {
    ctx.drawImage(img, 0, 0);
    return canvas;
  });
};

const ANGLES = {
  leftKnee: {left: 'leftAnkle', right: 'leftHip', label: 'LAnkleLKneeLHip'},
  leftHip: [
    {left: 'leftKnee', right: 'rightHip', label: 'LKneeLHipRHip'},
    {left: 'leftShoulder', right: 'rightHip', label: 'LShoulderLHipRHip'}
  ],
  leftShoulder: [
    {left: 'leftHip', right: 'leftElbow', label: 'LHipLShoulderLElbow'},
    {left: 'leftHip', right: 'rightShoulder', label: 'LHipLShoulderRShoulder'}
  ],
  leftElbow: {
    left: 'leftShoulder',
    right: 'leftWrist',
    label: 'LShoulderLElbowLWrist'
  },
  rightKnee: {left: 'rightAnkle', right: 'rightHip', label: 'RAnkleRKneeRHip'},
  rightHip: [
    {left: 'rightKnee', right: 'leftHip', label: 'RKneeRHipLHip'},
    {left: 'rightShoulder', right: 'leftHip'}
  ],
  rightShoulder: [
    {left: 'rightHip', right: 'rightElbow', label: 'RHipRShoulderRElbow'},
    {left: 'rightHip', right: 'leftShoulder', label: 'RHipRShoulderLShoulder'}
  ],
  rightElbow: {
    left: 'rightShoulder',
    right: 'rightWrist',
    label: 'RShoulderRElbowRWrist'
  }
};

const labelPose = pose =>
  pose.keypoints.reduce((all, point) => {
    all[point.part] = point.position;
    return all;
  }, {});

const getAngles = pose => {
  const labeled = labelPose(pose);
  return labeled.reduce((angles, point) => {
    if (ANGLES[point.part] && ANGLES.length) {
      ANGLES[point.part].forEach(vertex => {
        const {left, right, label} = vertex;
        angles[label] = angle(
          point.position.x,
          point.position.y,
          labeled[left].x,
          labeled[left].y,
          labeled[right].x,
          labeled[right].y
        );
      });
    } else if (ANGLES[point.part]) {
      const {left, right, label} = ANGLES[point.part];
      angles[label] = angle(
        point.position.x,
        point.position.y,
        labeled[left].x,
        labeled[left].y,
        labeled[right].x,
        labeled[right].y
      );
    }
  }, {});
};

const angleDifferences = (pose, targetPose) => {};

module.exports = {
  canvasify,
  getPose,
  angleDifferences,
  labelPose,
  getAngles
};
