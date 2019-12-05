import 'babel-polyfill';
// import tf from '@tensorflow/tfjs-node';
// import {posenet} from '@tensorflow-models/posenet';

const posenet = require('@tensorflow-models/posenet');
const _ = require('lodash');

const videoWidth = 720;
const videoHeight = 480;

export let handsKeyPoints;
export let leftHandPosition;
export let rightHandPosition;

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available'
    );
  }

  const video = document.querySelector('#video');
  video.width = videoWidth;
  video.height = videoHeight;

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: videoWidth,
      height: videoHeight
    }
  });

  video.srcObject = stream;

  return new Promise(resolve => {
    video.onloadedmetadata = () => resolve(video);
  });
}

let net;

let poseNetConfig = {
  algorithm: 'single-pose', //two options: single-pose or multi-pose
  input: {
    architecture: 'MobileNetV1',
    // architecture: 'ResNet50',
    outputStride: 16,
    inputResolution: {width: 640, height: 480},
    multiplier: 1,
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
  // net: null
};

//call getWireframe function (something from ./wireframe.js) that pulls keypoints from posenet read, and returns an object

const color = 'aqua';
const lineWidth = 2;

function toTuple({y, x}) {
  return [y, x];
}

function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeypoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

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

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];
    if (keypoint.score < minConfidence) {
      continue;
    }
    const {y, x} = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}

//global wireframes array
let wireframes = [];

//global pose
function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  // since images are being fed from a webcam, we want to feed in the
  // original image and then just flip the keypoints' x coordinates. If instead
  // we flip the image, then correcting left-right keypoint pairs requires a
  // permutation on all the keypoints.
  const flipPoseHorizontal = true;

  canvas.width = videoWidth;
  canvas.height = videoHeight;
  // let i = 0;

  let pose = {score: 0, keypoints: []};
  async function poseDetectionFrame() {
    let poses = [];
    let minPoseConfidence;
    let minPartConfidence;

    const runPoseNet = async () => {
      pose = await net.estimatePoses(video, {
        flipHorizontal: flipPoseHorizontal,
        decodingMethod: 'single-person'
      });
    };

    const throttledRunPoseNet = _.debounce(runPoseNet, 100);

    throttledRunPoseNet();

    //ISSUE: POSES ARR NOT CONCATENATING POSE ARRAY
    poses = poses.concat(pose);
    //push pose arr to wireframes (makes frame key of {} in line 194)
    wireframes.push(pose);
    minPoseConfidence = +poseNetConfig.singlePoseDetection.minPoseConfidence;
    minPartConfidence = +poseNetConfig.singlePoseDetection.minPartConfidence;

    ctx.clearRect(0, 0, videoWidth, videoHeight);

    //draw the video onto the canvas from streaming webcam
    if (poseNetConfig.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();
    }

    //loop through each pose and overlay wireframe skeleton
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        if (poseNetConfig.output.showPoints) {
          // handsKeyPoints = keypoints;
          // leftHandPosition = getLeftHand(keypoints);
          // rightHandPosition = getRightHand(keypoints);
          drawKeypoints(keypoints, minPartConfidence, ctx);
          drawSkeleton(keypoints, minPartConfidence, ctx);
        }
      }
    });

    //add frame to pose object
    let frame = requestAnimationFrame(poseDetectionFrame);
    poses.forEach(pose => {
      pose.frame = frame;
    });
  }
  poseDetectionFrame();
  // return wireframes;
}

async function init() {
  // We load the model.
  net = await posenet.load({
    architecture: poseNetConfig.input.architecture,
    outputStride: poseNetConfig.input.outputStride,
    inputResolution: poseNetConfig.input.inputResolution,
    multiplier: poseNetConfig.input.multiplier,
    quantBytes: poseNetConfig.input.quantBytes
  });

  let video;

  try {
    video = await setupCamera();
    video.play();
  } catch (e) {
    throw e;
  }

  detectPoseInRealTime(video, net);
  //wireframes becomes array of arrays
  console.log('Wireframes: ', wireframes);
}

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

init();
