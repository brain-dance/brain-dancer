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
  rightForeArm: ['RightWrist', 'RightElbow']
};

const getLengths = pose => {
  return Object.keys(SEGMENTS).reduce((lengths, segment) => {
    const [start, end] = SEGMENTS[segment];
    lengths[segment] = distance(...pose[start], ...pose[end]);
    return lengths;
  }, {});
};

const getCalibration = (source, target) => {
  const sourceLens = getLengths(source);
  const targetLens = getLengths(target);

  return Object.keys(sourceLens).reduce((calibration, segment) => {
    calibration[segment] = targetLens[segment] / sourceLens[segment];
  }, {});
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
  const waistMid = {
    x: (target.leftHip.x + target.rightHip.x) / 2,
    y: (target.leftHip.y + target.rightHip.y) / 2
  };

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
    x: waistMid.x + (Math.cos(waistAngle) * calibLengths.waist) / 2,
    y: waistMid.y + (Math.sin(waistAngle) * calibLengths.waist) / 2
  };

  scaled.leftHip = {
    x: waistMid.x - (Math.cos(waistAngle) * calibLengths.waist) / 2,
    y: waistMid.y - (Math.sin(waistAngle) * calibLengths.waist) / 2
  };

  //find left leg points
  theta = sourceAngles.LeftKneeLeftHipRightHip - waistAngle - Math.PI;
  scaled.leftKnee = {
    x: scaled.leftHip.x - calibLengths.leftThigh.x * Math.cos(theta),
    y: scaled.leftHip.y - calibLengths.leftThigh.y * Math.sin(theta)
  };

  theta = sourceAngles.LeftAnkleLeftKneeLeftHip - theta - Math.PI;
  scaled.leftThigh = {
    x: scaled.leftKnee.x - calibLengths.leftShin.x * Math.cos(theta),
    y: scaled.leftKnee.y - calibLengths.leftShin.y * Math.sin(theta)
  };

  //find right leg points
  theta = Math.PI - waistAngle - sourceAngles.RightKneeRightHipLeftHip;
  scaled.rightKnee = {
    x: scaled.rightHip.x + calibLengths.rightThigh.x * Math.cos(theta),
    y: scaled.rightHip.y - calibLengths.rightThigh.y * Math.cos(theta)
  };

  theta = Math.PI - theta - sourceAngles.RightKneeRightHipLeftHip;
  scaled.rightKnee = {
    x: scaled.rightKnee.x + calibLengths.rightShin.x * Math.cos(theta),
    y: scaled.rightKnee.y - calibLengths.rightShin.y * Math.cos(theta)
  };

  //find spine

  // find left arm points

  //find right arm points
};

module.exports = {
  centroid,
  angle,
  scaler,
  simpleScale,
  translate,
  distance,
  deepCopy
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
