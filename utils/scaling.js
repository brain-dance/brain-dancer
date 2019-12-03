const {getAngles} = require('./formatting');
const {getMidpoint, distance, angle, extrapolate} = require('./geometry');

//Notes - current scaling approach just straightforwardly squeezes or stretches the wireframe
//This might be a bit weird on users with wildly different proportions, but it makes the function indifferent as to the number of
//Keypoints we have access to.
//Additionally, all functions are pure - a new wireframe is returned any time scale or translate is called.

const deepCopy = obj => {
  //console.log(obj.prototype);
  if(Array.isArray(obj)){
    return obj.map(el=>typeof el=='object' ? deepCopy(el) : el)
  }
  const toReturn = Object.assign(
    Object.create(Object.getPrototypeOf(obj)),
    obj
  );
  const toReturnKeys = Object.keys(toReturn);
  toReturnKeys.forEach(key => {
    if (typeof toReturn[key] == 'object') {
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
    toReturn.x += wireframe[el].position.x;
    toReturn.y += wireframe[el].position.y;
  });
  toReturn.x /= temp.length;
  toReturn.y /= temp.length;
  return toReturn;
};
const translate = (wireframe, newCenter) => {
  let shifts = centroid(wireframe);
  shifts.x = newCenter.x - shifts.x;
  shifts.y = newCenter.y - shifts.y;
  let toReturn = deepCopy(wireframe);
  
  Object.keys(toReturn).forEach(el => {
    toReturn[el].position.x += shifts.x;
    toReturn[el].position.y += shifts.y;
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
  collar: ['leftShoulder', 'rightShoulder'],
  head: ['leftEar', 'rightEar']
};

const getSpineLength = pose => {
  const neck = getMidpoint(pose.leftShoulder, pose.rightShoulder);
  const pelvis = getMidpoint(pose.leftHip, pose.rightHip);

  return distance(pelvis.x, pelvis.y, neck.x, neck.y);
};

const getNeckLength = pose => {
  const neck = getMidpoint(pose.leftShoulder, pose.rightShoulder);
  const head = pose.head;

  return distance(neck.x, neck.y, head.x, head.y);
};

//finds all lengths for a given pose including the spine
const getLengths = pose => {
  const initial = {spine: getSpineLength(pose), neck: getNeckLength(pose)};
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

//returns a wireframe of the relative segment lengths
const getCalibration = (source, target) => {
  const sourceLens = getLengths(source);
  const targetLens = getLengths(target);

  return Object.keys(sourceLens).reduce((calibration, segment) => {
    calibration[segment] = targetLens[segment] / sourceLens[segment];
    return calibration;
  }, {});
};

//takes a source wireframe and retuns calibrated segment lengths
const calibrate = (source, calibration) => {
  const sourceLens = getLengths(source);
  return Object.keys(sourceLens).reduce((calibratedLens, segment) => {
    calibratedLens[segment] = sourceLens[segment] * calibration[segment];
    return calibratedLens;
  }, {});
};

//accepts labeled poses only
const scaler = (source, target, calibration) => {
  //get angles of correct wireframe
  const sourceAngles = getAngles(source);

  //calibrate segment lengths
  const calibLengths = calibrate(source, calibration);

  //find midpoints
  const sourcePelvis = getMidpoint(source.leftHip, source.rightHip);
  const targetPelvis = getMidpoint(target.leftHip, target.rightHip);

  //find angle waist makes with ground
  const waistAngle = sourceAngles.waist;

  //create new wireframe
  const scaled = {};

  //find new waist points (uses known waist midpoint and scaled waist length)
  scaled.rightHip = {
    x: targetPelvis.x + (Math.cos(waistAngle) * calibLengths.waist) / 2,
    y: targetPelvis.y + (Math.sin(waistAngle) * calibLengths.waist) / 2
  };

  scaled.leftHip = {
    x: targetPelvis.x - (Math.cos(waistAngle) * calibLengths.waist) / 2,
    y: targetPelvis.y - (Math.sin(waistAngle) * calibLengths.waist) / 2
  };

  //find left leg points using source angles
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

  //find right leg points using source angles
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

  //find scaled neck using scaled spine
  const scaledNeck = extrapolate(
    sourcePelvis,
    source.rightHip,
    calibLengths.spine,
    sourceAngles.spine
  );

  //find shoulders using neck as midpoint
  scaled.rightShoulder = extrapolate(
    scaledNeck,
    sourcePelvis,
    calibLengths.collar / 2,
    sourceAngles.shoulders
  );

  scaled.leftShoulder = extrapolate(
    scaledNeck,
    sourcePelvis,
    -calibLengths.collar / 2,
    sourceAngles.shoulders
  );

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

  //find head point
  scaled.head = extrapolate(
    scaledNeck,
    scaled.rightShoulder,
    calibLengths.neck,
    sourceAngles.neck
  );

  //find ear points
  scaled.rightEar = extrapolate(
    scaled.head,
    scaledNeck,
    calibLengths.head / 2,
    sourceAngles.head
  );

  scaled.leftEar = extrapolate(
    scaled.head,
    scaledNeck,
    -calibLengths.head / 2,
    sourceAngles.head
  );

  // pose is returned labeled
  return scaled;
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
