/* eslint-disable max-statements */
const {getAngles} = require('./formatting');

//Notes - current scaling approach just straightforwardly squeezes or stretches the wireframe
//This might be a bit weird on users with wildly different proportions, but it makes the function indifferent as to the number of
//Keypoints we have access to.
//Additionally, all functions are pure - a new wireframe is returned any time scale or translate is called.
const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
const angle = (centerX, centerY, x2, y2, x3, y3) => {
  //Need to include a check for sign of the angle
  return Math.acos(
    ((x2 - centerX) * (x3 - centerX) + (y2 - centerY) * (y3 - centerY)) /
      (distance(centerX, centerY, x2, y2) * distance(centerX, centerY, x3, y3))
  );
};

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

const nextPoint = (x1, y1, x2, y2, theta, distance) => {
  let temp = angle(x1, y1, x2, y2, x2, y1) + theta;
  return {x: x1 + distance * Math.cos(temp), y: y1 + distance * Math.sin(temp)};
};

const dDistancedX1 = (x1, y1, x2, y2) => {
  return (
    (1 / 2) *
    Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), -0.5) *
    (2 * x1 - 2 * x2)
  );
};
const dAngledcenterX = (centerX, centerY, x2, y2, x3, y3) => {
  let u = (x2 - centerX) * (x3 - centerX) + (y2 - centerY) * (y3 - centerY);
  let du = centerX * (x3 + x2 - 2 * centerX) * -1;
  let v =
    distance(centerX, centerY, x2, y2) * distance(centerX, centerY, x3, y3);
  let dv =
    dDistancedX1(centerX, centerY, x2, y2) *
      distance(centerX, centerY, x3, y3) +
    dDistancedX1(centerX, centerY, x3, y3) * distance(centerX, centerY, x2, y2);
  return (u * dv - v * du) / Math.pow(v, 2);
};
const dAngledx2 = (centerX, centerY, x2, y2, x3, y3) => {
  let u = (x2 - centerX) * (x3 - centerX) + (y2 - centerY) * (y3 - centerY);
  let v =
    distance(centerX, centerY, x2, y2) * distance(centerX, centerY, x3, y3);
  let du = x3 - centerX;
  let dv =
    dDistancedX1(x2, y2, centerX, centerY) * distance(centerX, centerY, x3, y3);
  return (u * dv - v * du) / Math.pow(v, 2);
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
  leftShin: ['LeftAnkle', 'LeftKnee'],
  rightShin: ['RightAnkle', 'RightKnee'],
  leftThigh: ['LeftKnee', 'LeftHip'],
  rightThigh: ['RightKnee', 'RightHip'],
  waist: ['LeftHip', 'RightHip'],
  leftTorso: ['LeftHip', 'LeftShoulder'],
  rightTorso: ['RightHip', 'RightShoulder'],
  leftUpperArm: ['LeftShoulder', 'LeftElbow'],
  rightUpperArm: ['RightShoulder', 'RightElbow'],
  leftForeArm: ['LeftWrist', 'LeftElbow'],
  rightForeArm: ['RightWrist', 'RightElbow'],
  collar: ['LeftShoulder, RightShoulder']
};

const getLengths = pose => {
  return Object.keys(SEGMENTS).reduce((lengths, segment) => {
    const [start, end] = SEGMENTS[segment];
    lengths[segment] = distance(
      pose[start].x,
      pose[start].y,
      pose[end].x,
      pose[end].y
    );
    return lengths;
  }, {});
};

const getMidpoint = (x1, y1, x2, y2) => {
  return {x: (x1 + x2) / 2, y: (y1 + y2) / 2};
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

const calibrateSpine = (source, target) => {
  return getSpineLength(target) / getSpineLength(source);
};

const getCalibration = (source, target) => {
  const sourceLens = getLengths(source);
  const targetLens = getLengths(target);

  const initial = {
    spine: calibrateSpine(source, target)
  };

  return Object.keys(sourceLens).reduce((calibration, segment) => {
    calibration[segment] = targetLens[segment] / sourceLens[segment];
  }, initial);
};

const calibrate = (source, calibration) => {
  const sourceLens = getLengths(source);
  return Object.keys(sourceLens).reduce((calibratedLens, segment) => {
    calibratedLens[segment] = sourceLens[segment] * calibration[segment];
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
    (source.leftHip.y + source.rightHip.y) /
      (source.leftHip.x + source.rightHip.x)
  );

  //find angle shoulders make with ground
  const shouldersAngle = Math.atan(
    (source.rightShoulder.y + source.rightShoulder.y) /
      (source.leftShoulder.x + source.rightShoulder.x)
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
  theta = sourceAngles.LeftKneeLeftHipRightHip - waistAngle - Math.PI;
  scaled.leftKnee = {
    x: scaled.leftHip.x - calibLengths.leftThigh * Math.cos(theta),
    y: scaled.leftHip.y - calibLengths.leftThigh * Math.sin(theta)
  };

  theta = sourceAngles.LeftAnkleLeftKneeLeftHip - theta - Math.PI;
  scaled.leftThigh = {
    x: scaled.leftKnee.x - calibLengths.leftShin * Math.cos(theta),
    y: scaled.leftKnee.y - calibLengths.leftShin * Math.sin(theta)
  };

  //find right leg points
  theta = Math.PI - waistAngle - sourceAngles.RightKneeRightHipLeftHip;
  scaled.rightKnee = {
    x: scaled.rightHip.x + calibLengths.rightThigh * Math.cos(theta),
    y: scaled.rightHip.y - calibLengths.rightThigh * Math.sin(theta)
  };

  theta = Math.PI - theta - sourceAngles.RightKneeRightHipLeftHip;
  scaled.rightKnee = {
    x: scaled.rightKnee.x + calibLengths.rightShin * Math.cos(theta),
    y: scaled.rightKnee.y - calibLengths.rightShin * Math.sin(theta)
  };

  //find spine
  const spineAngle = angle(
    sourcePelvis.x,
    sourcePelvis.y,
    source.rightHip.x,
    source.rightHip.y,
    sourceNeck.x,
    sourceNeck.y
  );

  const spineLength = getSpineLength(source) * calibLengths.spine;

  //find scaled neck
  theta = Math.PI + waistAngle + spineAngle;
  const scaledNeck = {
    x: sourcePelvis.x + spineLength * Math.cos(theta),
    y: sourcePelvis.y + spineLength * Math.sin(theta)
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
  theta =
    sourceAngles.LeftElbowLeftShoulderRightShoulder - shouldersAngle - Math.PI;
  scaled.leftElbow = {
    x: scaled.leftShoulder.x - calibLengths.leftUpperArm * Math.cos(theta),
    y: scaled.leftShoulder.y - calibLengths.leftUpperArm * Math.sin(theta)
  };

  theta = sourceAngles.LeftWristLeftElbowLeftShoulder - theta - Math.PI;
  scaled.leftWrist = {
    x: scaled.leftElbow.x - calibLengths.leftForeArm * Math.cos(theta),
    y: scaled.leftElbow.y - calibLengths.leftForeArm * Math.sin(theta)
  };

  //find right arm points
  theta =
    Math.PI - shouldersAngle - sourceAngles.RightElbowRightShoulderLeftShoulder;
  scaled.rightElbow = {
    x: scaled.rightShoulder.x + calibLengths.rightUpperArm * Math.cos(theta),
    y: scaled.rightShoulder.y - calibLengths.rightUpperArm * Math.sin(theta)
  };

  theta = Math.PI - theta - sourceAngles.RightWristRightElbowRightShoulder;
  scaled.rightWrist = {
    x: scaled.rightElbow.x + calibLengths.rightForeArm * Math.cos(theta),
    y: scaled.rightElbow.y - calibLengths.rightForeArm * Math.sin(theta)
  };
};

module.exports = {
  centroid,
  angle,
  scaler,
  simpleScale,
  translate,
  distance,
  deepCopy,
  getCalibration
};
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
