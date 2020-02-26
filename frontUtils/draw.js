import {getAdjacentKeyPoints} from '@tensorflow-models/posenet/dist';

const color = 'aqua';
const lineWidth = 2;

/**
 * Takes an object with two key-value pairs, and outputs them as a tuple
 * (two-element array).
 *
 * @param {{y: number, x: number}} {y,x} destructured object of two key-value pairs
 * @param {number} Obj.y
 * @param {number} Obj.x
 *
 * @returns {array}
 */
function toTuple({y, x}) {
  return [y, x];
}

/**
 * Takes a context, and draws a point (small circle) on the context.
 * @param {context} ctx canvas context (in Coreo, the canvas laid atop dancer video)
 * @param {number} y coordinate
 * @param {number} x coordinate
 * @param {number} radius
 * @param {string} color
 * @return does not return a value.
 */
function drawPoint(ctx, y, x, r, color) {
  //console.log(ctx);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Takes a context, and draws a segment onto the context.
 * @param {array} startingPoint tuple coordinates of start point of segment
 * @param {array} endingPoint tuple coordinates of end point of segment
 * @param {string} color
 * @param {number} scale
 * @param {context} ctx
 * @return does not return a value.
 */
function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * Takes the keypoints from a given previously generated PoseNet 'pose' and generates segments of a skelly on a given context.
 * @param {array} keypoints list of body key points used by PoseNet
 * @param {number} minConfidence
 * @param {context} ctx
 * @param {number} scale
 * @param {string} color
 * @returns does not return a value.
 */
export function drawSkeleton(
  keypoints,
  minConfidence,
  ctx,
  scale = 1,
  color = 'aqua'
) {
  const adjacentKeypoints = getAdjacentKeyPoints(keypoints, minConfidence);

  adjacentKeypoints.forEach(keypoints => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      color,
      scale,
      ctx
    );
  });
}

/**
 * Takes the keypoints from a given previously generated PoseNet 'pose' and generates points of a skelly on a given context.
 * @param {array} keypoints list of body key points used by PoseNet
 * @param {number} minConfidence
 * @param {context} ctx
 * @param {number} scale
 * @param {string} color
 * @returns does not return a value.
 */
export function drawKeypoints(
  keypoints,
  minConfidence,
  ctx,
  scale = 1,
  color = 'aqua'
) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];
    if (keypoint.score < minConfidence) {
      continue;
    }
    const {y, x} = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}
