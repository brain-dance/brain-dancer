/* eslint-disable max-statements */
const {getAngles} = require('./formatting');
const {getMidpoint, distance, angle, extrapolate} = require('./geometry');

//Notes - current scaling approach just straightforwardly squeezes or stretches the wireframe
//This might be a bit weird on users with wildly different proportions, but it makes the function indifferent as to the number of
//Keypoints we have access to.
//Additionally, all functions are pure - a new wireframe is returned any time scale or translate is called.

const deepCopy = obj => {
  console.log(obj.prototype);
  const toReturn = Object.assign(
    Object.create(Object.getPrototypeOf(obj)),
    obj
  );
  const toReturnKeys = Object.keys(toReturn);
  toReturnKeys.forEach(key => {
    if (typeof key == 'object') {
      toReturn[key] = deepCopy(toReturn[key]);
    }
  });
  return toReturn;
};

/*const scale=(distances, angles)=>{
    let points=[];
    let curr={x1: 0, y1: 0, x2: 1, y2: 0};

}*/
const centroid = wireframe => {
  let toReturn = {x: 0, y: 0};
  let temp = Object.keys(wireframe);
  temp.forEach(el => {
    toReturn.x += wireframe[el].x;
    toReturn.y += wireframe[el].y;
  });
  toReturn.x /= temp.length;
  toReturn.y /= temp.length;
};
const translate = (wireframe, newCenter) => {
  let shifts = centroid(wireframe);
  shifts.x = newCenter.x - shifts.x;
  shifts.y = newCenter.y - shifts.y;
  let toReturn = deepCopy(wireframe);
  Object.keys(toReturn).forEach(el => {
    toReturn[el].x += shifts.x;
    toReturn[el].y += shifts.y;
  });
  return toReturn;
};

const getVol = wireframe => {
  let temp = {
    x1,
    y1,
    x2,
    y2
  };
  Object.keys(wireframe).forEach(el => {
    if (wireframe[el].x > temp.x2) {
      temp.x2 = wireframe[el].x;
    }
    if (wireframe[el].x < temp.x1) {
      temp.x1 = wireframe[el].x;
    }
    if (wireframe[el].y > temp.y2) {
      temp.y2 = wireframe[el].y;
    }
    if (wireframe[el].y < temp.y1) {
      temp.y1 = wireframe[el].y;
    }
  });
  return (temp.y2 - temp.y1) * (temp.x2 - temp.x1);
};
const simpleScale = (wireframe, ratio) => {
  //Going to assume that we don't care about preserving position during a rescale, since we set that manually everywhere
  let toReturn = deepCopy(wireframe);
  Object.keys(toReturn).forEach(el => {
    toReturn[el].x *= ratio;
    toReturn[el].y *= ratio;
  });
};
// const scaler = (source, target) => {
//   let ratio = getVol(target) / getVol(source);
//   return wireframe => simpleScale(wireframe, ratio);
// };

const SEGMENTS = {
  leftShin: ['leftAnkle', 'leftKnee'],
  rightShin: ['rightAnkle', 'rightKnee'],
  leftThigh: ['leftKnee', 'leftHip'],
  rightThigh: ['rightKnee', 'rightHip'],
  waist: ['leftHip', 'rightHip'],
  leftTorso: ['leftHip', 'leftShoulder'],
  rightTorso: ['rightHip', 'rightShoulder'],
  leftUpperArm: ['leftShoulder', 'leftElbow'],
  rightUpperArm: ['rightShoulder', 'rightElbow'],
  leftForeArm: ['leftWrist', 'leftElbow'],
  rightForeArm: ['rightWrist', 'rightElbow'],
  collar: ['leftShoulder', 'rightShoulder']
};

const getSpineLength = pose => {
  const neck = getMidpoint(
    pose.leftShoulder.x,
    pose.leftShoulder.y,
    pose.rightShoulder.x,
    pose.rightShoulder.y
  );

  const pelvis = getMidpoint(
    pose.leftHip.x,
    pose.leftHip.y,
    pose.rightHip.x,
    pose.rightHip.y
  );

  return distance(pelvis.x, pelvis.y, neck.x, neck.y);
};

const getLengths = pose => {
  const initial = {spine: getSpineLength(pose)};
  return Object.keys(SEGMENTS).reduce((lengths, segment) => {
    const [start, end] = SEGMENTS[segment];
    lengths[segment] = distance(
      pose[start].x,
      pose[start].y,
      pose[end].x,
      pose[end].y
    );
    return lengths;
  }, initial);
};

const getCalibration = (source, target) => {
  const sourceLens = getLengths(source);
  const targetLens = getLengths(target);

  return Object.keys(sourceLens).reduce((calibration, segment) => {
    calibration[segment] = targetLens[segment] / sourceLens[segment];
    return calibration;
  }, {});
};

const calibrate = (source, calibration) => {
  const sourceLens = getLengths(source);
  return Object.keys(sourceLens).reduce((calibratedLens, segment) => {
    calibratedLens[segment] = sourceLens[segment] * calibration[segment];
    return calibratedLens;
  }, {});
};

const scaler = (source, target, calibration) => {
  //get angles of correct wireframe
  const sourceAngles = getAngles(source);

  //calibrate segment lengths
  const calibLengths = calibrate(source, calibration);

  //find waist midpoint
  const sourcePelvis = getMidpoint(
    source.leftHip.x,
    source.leftHip.y,
    source.rightHip.x,
    source.rightHip.y
  );

  const sourceNeck = getMidpoint(
    source.leftShoulder.x,
    source.leftShoulder.y,
    source.rightShoulder.x,
    source.rightShoulder.y
  );

  const targetPelvis = getMidpoint(
    target.leftHip.x,
    target.leftHip.y,
    target.rightHip.x,
    target.rightHip.y
  );

  //find angle waist makes with ground
  const waistAngle = Math.atan(
    (source.rightHip.y - source.leftHip.y) /
      (source.rightHip.x - source.leftHip.x)
  );

  //find angle shoulders make with ground
  const shouldersAngle = Math.atan(
    (source.rightShoulder.y - source.leftShoulder.y) /
      (source.rightShoulder.x - source.leftShoulder.x)
  );

  //create new wireframe
  const scaled = {};
  let theta;

  //find new waist points
  scaled.rightHip = {
    x: targetPelvis.x + (Math.cos(waistAngle) * calibLengths.waist) / 2,
    y: targetPelvis.y + (Math.sin(waistAngle) * calibLengths.waist) / 2
  };

  scaled.leftHip = {
    x: targetPelvis.x - (Math.cos(waistAngle) * calibLengths.waist) / 2,
    y: targetPelvis.y - (Math.sin(waistAngle) * calibLengths.waist) / 2
  };

  //find left leg points
  scaled.leftKnee = extrapolate(
    scaled.leftHip,
    scaled.rightHip,
    calibLengths.leftThigh,
    sourceAngles.RightHipLeftHipLeftKnee
  );

  scaled.leftAnkle = extrapolate(
    scaled.leftKnee,
    scaled.leftHip,
    calibLengths.leftShin,
    sourceAngles.LeftHipLeftKneeLeftAnkle
  );

  //find right leg points
  scaled.rightKnee = extrapolate(
    scaled.rightHip,
    scaled.leftHip,
    calibLengths.rightThigh,
    sourceAngles.LeftHipRightHipRightKnee
  );

  scaled.rightAnkle = extrapolate(
    scaled.rightKnee,
    scaled.rightHip,
    calibLengths.rightShin,
    sourceAngles.RightHipRightKneeRightAnkle
  );

  //find spine
  const spineAngle = angle(
    sourcePelvis.x,
    sourcePelvis.y,
    source.rightHip.x,
    source.rightHip.y,
    sourceNeck.x,
    sourceNeck.y
  );

  //find scaled neck
  theta = waistAngle + spineAngle;
  const scaledNeck = {
    x: sourcePelvis.x + calibLengths.spine * Math.cos(theta),
    y: sourcePelvis.y + calibLengths.spine * Math.sin(theta)
  };

  //find shoulders
  scaled.leftShoulder = {
    x: scaledNeck.x - (calibLengths.collar * Math.cos(shouldersAngle)) / 2,
    y: scaledNeck.y - (calibLengths.collar * Math.sin(shouldersAngle)) / 2
  };

  scaled.rightShoulder = {
    x: scaledNeck.x + (calibLengths.collar * Math.cos(shouldersAngle)) / 2,
    y: scaledNeck.y + (calibLengths.collar * Math.sin(shouldersAngle)) / 2
  };

  // find left arm points

  scaled.leftElbow = extrapolate(
    scaled.leftShoulder,
    scaled.rightShoulder,
    calibLengths.leftUpperArm,
    sourceAngles.RightShoulderLeftShoulderLeftElbow
  );

  scaled.leftWrist = extrapolate(
    scaled.leftElbow,
    scaled.leftShoulder,
    calibLengths.leftForeArm,
    sourceAngles.LeftShoulderLeftElbowLeftWrist
  );

  //find right arm points
  scaled.rightElbow = extrapolate(
    scaled.rightShoulder,
    scaled.leftShoulder,
    calibLengths.rightUpperArm,
    sourceAngles.LeftShoulderRightShoulderRightElbow
  );

  scaled.rightWrist = extrapolate(
    scaled.rightElbow,
    scaled.rightShoulder,
    calibLengths.rightForeArm,
    sourceAngles.RightShoulderRightElbowRightWrist
  );

  //return keypoints as pose
  return {
    keypoints: Object.keys(scaled).reduce((parts, part) => {
      parts.push({part, position: scaled[part]});
      return parts;
    }, [])
  };
};

module.exports.angle = angle;
module.exports.centroid = centroid;
module.exports.scaler = scaler;
module.exports.simpleScale = simpleScale;
module.exports.translate = translate;
module.exports.distance = distance;
module.exports.deepCopy = deepCopy;
module.exports.getCalibration = getCalibration;

/*
    All below is irrelevant.  Keeping mostly as a reminder I want to learn the algorithm later.

const FArr=(vec)=>{
    //Do some stuff in a bit
}
const Jacobian=(vec)=>{
    //Do some stuff in a bit
}
const vecToFrame=(vec)=>{
    //Do some stuff
}

const scale=(targets, errBound)=>{
const targetParams=[];
let currVals=[];
let currFArr=FArr(currVals)
let error=(mathJS.add(targetParams, mathJS.multiply(currFArr,-1)));
while(mathJS.dot(error, error)>errBound){
    currVals=mathJS.add(currVals, mathJS.multiply(mathJS.multiply(mathJS.inv(Jacobian(currVals)), currFArr), -1));
    currFArr=FArr(currVals);
}
return currVals;
}


module.exports={
    scale, angle, distance
}*/
