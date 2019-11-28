const {angle} = require('./geometry');
const {createCanvas, loadImage} = require('canvas');
const {singlePoseNet} = require('./posenet');
const sizeOf = require('image-size');

const getPose = async input => {
  const net = await singlePoseNet();
  return net.estimateSinglePose(input, {
    flipHorizontal: true
  });
};

const canvasify = async imagePath => {
  const dim = sizeOf(imagePath);
  const canvas = await createCanvas(dim.width, dim.height);
  const ctx = await canvas.getContext('2d');
  return loadImage(imagePath).then(img => {
    ctx.drawImage(img, 0, 0);
    return canvas;
  });
};

const labelPose = pose => {
  const labeled = pose.keypoints.reduce((all, point) => {
    all[point.part] = point.position;
    return all;
  }, {});

  labeled.head = {
    x: (labeled.leftEye.x + labeled.nose.x + labeled.rightEye.x) / 3,
    y: (labeled.leftEye.y + labeled.nose.y + labeled.rightEye.y) / 3
  };

  delete labeled.leftEye;
  delete labeled.rightEye;
  delete labeled.nose;

  return labeled;
};
//Note - functions in scoring.js depend on these label names.  If label names change, be sure to update scoring as well.
const ANGLES = {
  leftKnee: {
    left: 'leftAnkle',
    right: 'leftHip',
    label: 'LeftAnkleLeftKneeLeftHip'
  },
  leftHip: [
    {left: 'leftKnee', right: 'rightHip', label: 'LeftKneeLeftHipRightHip'},
    {
      left: 'leftShoulder',
      right: 'rightHip',
      label: 'LeftShoulderLeftHipRightHip'
    }
  ],
  leftShoulder: [
    {
      left: 'leftHip',
      right: 'leftElbow',
      label: 'LeftHipLeftShoulderLeftElbow'
    },
    {
      left: 'leftElbow',
      right: 'rightShoulder',
      label: 'LeftElbowLeftShoulderRightShoulder'
    }
  ],
  leftElbow: {
    left: 'leftWrist',
    right: 'leftShoulder',
    label: 'LeftWristLeftElbowLeftShoulder'
  },
  rightKnee: {
    left: 'rightAnkle',
    right: 'rightHip',
    label: 'RightAnkleRightKneeRightHip'
  },
  rightHip: [
    {left: 'rightKnee', right: 'leftHip', label: 'RightKneeRightHipLeftHip'},
    {
      left: 'rightShoulder',
      right: 'leftHip',
      label: 'RightShoulderRightHipLeftHip'
    }
  ],
  rightShoulder: [
    {
      left: 'rightHip',
      right: 'rightElbow',
      label: 'RightHipRightShoulderRightElbow'
    },
    {
      left: 'rightHip',
      right: 'leftShoulder',
      label: 'RightHipRightShoulderLeftShoulder'
    },
    {
      left: 'rightElbow',
      right: 'leftShoulder',
      label: 'RightElbowRightShoulderLeftShoulder'
    }
  ],
  rightElbow: {
    left: 'rightWrist',
    right: 'rightShoulder',
    label: 'RightWristRightElbowRightShoulder'
  }
};

const getAngles = pose => {
  let labeled;
  if (pose.score) {
    labeled = labelPose(pose);
  } else {
    labeled = pose;
  }
  const angles = {};
  for (const point in labeled) {
    if (ANGLES[point] && ANGLES[point].length) {
      ANGLES[point].forEach(vertex => {
        const {left, right, label} = vertex;
        angles[label] = angle(
          labeled[point].x,
          labeled[point].y,
          labeled[left].x,
          labeled[left].y,
          labeled[right].x,
          labeled[right].y
        );
      });
    } else if (ANGLES[point]) {
      const {left, right, label} = ANGLES[point];
      angles[label] = angle(
        labeled[point].x,
        labeled[point].y,
        labeled[left].x,
        labeled[left].y,
        labeled[right].x,
        labeled[right].y
      );
    } else if (point === 'leftEar') {
      angles.head = angle(
        labeled.leftEar.x,
        labeled.leftEar.y,
        labeled.leftEar.x + 10,
        labeled.leftEar.y,
        labeled.rightEar.x,
        labeled.rightEar.y
      );
    }
  }

  return angles;
};

const angleDifferences = (pose, targetPose) => {
  // if poses are not labeled
  if (pose.score) pose = labelPose(pose);
  if (targetPose.score) targetPose = labelPose(targetPose);

  const poseAngles = getAngles(pose);
  const targetAngles = getAngles(targetPose);

  const differences = {};
  //  differences.cost=0;
  //let count=0;
  for (const angleName in poseAngles) {
    if (Object.prototype.hasOwnProperty.call(poseAngles, angleName)) {
      count++;
      differences[angleName] = poseAngles[angleName] - targetAngles[angleName];
      differences.cost += differences[angleName] ** 2;
    }
  }
  //differences.cost=differences.cost**0.5;
  //differences.cost/=count;

  return differences;
};

module.exports.getPose = getPose;
module.exports.canvasify = canvasify;
module.exports.labelPose = labelPose;
module.exports.getAngles = getAngles;
module.exports.angleDifferences = angleDifferences;
module.exports.ANGLES = ANGLES;
