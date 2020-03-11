/* ********************
  Currently this file is for reference only - exposing the IDs, methods, and
  pose chain outputs from PoseNet.
  ******************** */

// const posenet = require('@tensorflow-models/posenet');
// console.log(posenet.scalePose.toString());

// {
//   MobileNet: [Function: MobileNet],
//   decodeMultiplePoses: [Function: decodeMultiplePoses],
//   decodeSinglePose: [Function: decodeSinglePose],
//   partChannels: [
//     'left_face',             'right_face',
//     'right_upper_leg_front', 'right_lower_leg_back',
//     'right_upper_leg_back',  'left_lower_leg_front',
//     'left_upper_leg_front',  'left_upper_leg_back',
//     'left_lower_leg_back',   'right_feet',
//     'right_lower_leg_front', 'left_feet',
//     'torso_front',           'torso_back',
//     'right_upper_arm_front', 'right_upper_arm_back',
//     'right_lower_arm_back',  'left_lower_arm_front',
//     'left_upper_arm_front',  'left_upper_arm_back',
//     'left_lower_arm_back',   'right_hand',
//     'right_lower_arm_front', 'left_hand'
//   ],
//   partIds: {
//     nose: 0,
//     leftEye: 1,
//     rightEye: 2,
//     leftEar: 3,
//     rightEar: 4,
//     leftShoulder: 5,
//     rightShoulder: 6,
//     leftElbow: 7,
//     rightElbow: 8,
//     leftWrist: 9,
//     rightWrist: 10,
//     leftHip: 11,
//     rightHip: 12,
//     leftKnee: 13,
//     rightKnee: 14,
//     leftAnkle: 15,
//     rightAnkle: 16
//   },
//   partNames: [
//     'nose',          'leftEye',
//     'rightEye',      'leftEar',
//     'rightEar',      'leftShoulder',
//     'rightShoulder', 'leftElbow',
//     'rightElbow',    'leftWrist',
//     'rightWrist',    'leftHip',
//     'rightHip',      'leftKnee',
//     'rightKnee',     'leftAnkle',
//     'rightAnkle'
//   ],
//   poseChain: [
//     [ 'nose', 'leftEye' ],
//     [ 'leftEye', 'leftEar' ],
//     [ 'nose', 'rightEye' ],
//     [ 'rightEye', 'rightEar' ],
//     [ 'nose', 'leftShoulder' ],
//     [ 'leftShoulder', 'leftElbow' ],
//     [ 'leftElbow', 'leftWrist' ],
//     [ 'leftShoulder', 'leftHip' ],
//     [ 'leftHip', 'leftKnee' ],
//     [ 'leftKnee', 'leftAnkle' ],
//     [ 'nose', 'rightShoulder' ],
//     [ 'rightShoulder', 'rightElbow' ],
//     [ 'rightElbow', 'rightWrist' ],
//     [ 'rightShoulder', 'rightHip' ],
//     [ 'rightHip', 'rightKnee' ],
//     [ 'rightKnee', 'rightAnkle' ]
//   ],
//   load: [Function: load],
//   PoseNet: [Function: PoseNet],
//   getAdjacentKeyPoints: [Function: getAdjacentKeyPoints],
//   getBoundingBox: [Function: getBoundingBox],
//   getBoundingBoxPoints: [Function: getBoundingBoxPoints],
//   scaleAndFlipPoses: [Function: scaleAndFlipPoses],
//   scalePose: [Function: scalePose]
// }
