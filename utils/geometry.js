const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// returns the angle made by three points starting from the second point
// and moving counter-clockwise to the third point
// the returned angle is in radians with range -2pi to 2pi
const angle = (centerX, centerY, x2, y2, x3, y3) => {
  let theta2 = Math.atan2(y3 - centerY, x3 - centerX);
  let theta1 = Math.atan2(y2 - centerY, x2 - centerX);

  if (theta1 < 0) theta1 = 2 * Math.PI + theta1;
  if (theta2 < 0) theta2 = 2 * Math.PI + theta2;

  return theta2 - theta1;

  // return Math.acos(
  //   ((x2 - centerX) * (x3 - centerX) + (y2 - centerY) * (y3 - centerY)) /
  //     (distance(centerX, centerY, x2, y2) * distance(centerX, centerY, x3, y3))
  // );
};

const nextPoint = (x1, y1, x2, y2, theta, length) => {
  let temp = angle(x1, y1, x2, y1, x2, y2) + theta;
  return {x: x1 + length * Math.cos(temp), y: y1 + length * Math.sin(temp)};
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

// finds the midpoint of two angles
const getMidpoint = (left, right) => {
  return {x: (left.x + right.x) / 2, y: (left.y + right.y) / 2};
};

// takes a two points, a length, and an angle theta
// returns a point a distance r from the first point and
// creating an angle theta with the previous point
const extrapolate = (point, prevPoint, r, theta) => {
  let theta0 = Math.atan2(prevPoint.y - point.y, prevPoint.x - point.x);
  if (theta0 < 0) theta0 = 2 * Math.PI + theta0;
  return {
    x: point.x + r * Math.cos(theta + theta0),
    y: point.y + r * Math.sin(theta + theta0)
  };
};

module.exports.getMidpoint = getMidpoint;
module.exports.angle = angle;
module.exports.distance = distance;
module.exports.nextPoint = nextPoint;
module.exports.extrapolate = extrapolate;
