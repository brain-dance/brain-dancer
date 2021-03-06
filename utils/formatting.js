const {angle, getMidpoint} = require('./geometry');

/**
 * Takes a PoseNet generated pose and updates key-value pairs so that the pose can be used for processing in other functions
 * <br/>
 * Refactors input pose to be uniform with format needed for some utility functions, like getAngle
 * @param {object} pose PoseNet model generated JSON object
 */
const labelPose = pose => {
  const labeled = pose.keypoints.reduce((all, point) => {
    all[point.part] = point.position;
    return all;
  }, {});

  labeled.head = getMidpoint(labeled.leftEar, labeled.rightEar);

  delete labeled.leftEye;
  delete labeled.rightEye;
  delete labeled.nose;

  return labeled;
};

/**
 * Logical reverse of labelPose. Refactors input pose to be uniform with PoseNet format
 * @param {object} labeledPose
 */
const unlabelPose = labeledPose => {
  return {
    keypoints: Object.keys(labeledPose).map(part => {
      if (part === 'head') return {part: 'nose', position: labelPose[part]};
      return {
        part,
        position: labeledPose[part]
      };
    })
  };
};

//Note - functions in scoring.js depend on these label names.  If label names change, be sure to update scoring as well.
const ANGLES = {
  leftKnee: {
    left: 'leftHip',
    right: 'leftAnkle',
    label: 'LeftHipLeftKneeLeftAnkle'
  },
  leftHip: {
    left: 'rightHip',
    right: 'leftKnee',
    label: 'RightHipLeftHipLeftKnee'
  },
  leftShoulder: {
    left: 'rightShoulder',
    right: 'leftElbow',
    label: 'RightShoulderLeftShoulderLeftElbow'
  },
  leftElbow: {
    left: 'leftShoulder',
    right: 'leftWrist',
    label: 'LeftShoulderLeftElbowLeftWrist'
  },
  rightKnee: {
    left: 'rightHip',
    right: 'rightAnkle',
    label: 'RightHipRightKneeRightAnkle'
  },
  rightHip: {
    left: 'leftHip',
    right: 'rightKnee',
    label: 'LeftHipRightHipRightKnee'
  },
  rightShoulder: {
    left: 'leftShoulder',
    right: 'rightElbow',
    label: 'LeftShoulderRightShoulderRightElbow'
  },
  rightElbow: {
    left: 'rightShoulder',
    right: 'rightWrist',
    label: 'RightShoulderRightElbowRightWrist'
  }
};

/**
  * takes a pose object, calculates all the angles between spine, shoulders,
  neck, and head () and outputs as an object.
  * @param {object} pose
  * @returns object
  */
const getAngles = pose => {
  let labeled;
  if (pose.score) {
    labeled = labelPose(pose);
  } else {
    labeled = pose;
  }
  const angles = {
    waist: angle(
      pose.leftHip.x,
      pose.leftHip.y,
      pose.rightHip.x,
      pose.leftHip.y,
      pose.rightHip.x,
      pose.rightHip.y
    )
  };

  //find spine angle
  const pelvis = getMidpoint(pose.leftHip, pose.rightHip);
  const neck = getMidpoint(pose.leftShoulder, pose.rightShoulder);

  angles.spine = angle(
    pelvis.x,
    pelvis.y,
    pose.rightHip.x,
    pose.rightHip.y,
    neck.x,
    neck.y
  );

  //find shoulders angle
  angles.shoulders = angle(
    neck.x,
    neck.y,
    pelvis.x,
    pelvis.y,
    pose.rightShoulder.x,
    pose.rightShoulder.y
  );

  // find neck angle
  angles.neck = angle(
    neck.x,
    neck.y,
    pose.rightShoulder.x,
    pose.rightShoulder.y,
    pose.head.x,
    pose.head.y
  );

  // find head angle
  angles.head = angle(
    pose.head.x,
    pose.head.y,
    neck.x,
    neck.y,
    pose.rightEar.x,
    pose.rightEar.y
  );

  for (const point in labeled) {
    if (ANGLES[point]) {
      const {left, right, label} = ANGLES[point];
      angles[label] = angle(
        labeled[point].x,
        labeled[point].y,
        labeled[left].x,
        labeled[left].y,
        labeled[right].x,
        labeled[right].y
      );
    }
  }

  return angles;
};

/**
   * angleDifferences takes the angles from the dancer's pose and the target
  (choreographer's) pose and returns an object with the difference in angles,
  dancer angle - target angle.
   * @param {object} pose dancer's pose
   * @param {object} targetPose choreographer's pose
   * @returns {object} differences
   */
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
      //count++;
      differences[angleName] = poseAngles[angleName] - targetAngles[angleName];
      //differences.cost+=differences[angleName]**2;
    }
  }
  //differences.cost=differences.cost**0.5;
  //differences.cost/=count;

  return differences;
};

module.exports.labelPose = labelPose;
module.exports.getAngles = getAngles;
module.exports.angleDifferences = angleDifferences;
module.exports.ANGLES = ANGLES;
module.exports.unlabelPose = unlabelPose;
/*module.exports = {
  getPose,
  canvasify,
  labelPose,
  getAngles,
  angleDifferences,
  ANGLES
};*/
