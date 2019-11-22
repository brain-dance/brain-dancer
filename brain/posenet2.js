import 'babel-polyfill';
// import tf from '@tensorflow/tfjs-node';
// import {posenet} from '@tensorflow-models/posenet';
import {player} from '../videocapture/videorecord'; //player from recording

const posenet = require('@tensorflow-models/posenet');
let myWorker;
let messages = [];
const videoWidth = 360;
const videoHeight = 240;
const workerCanv = document.createElement('canvas');
workerCanv.width = videoWidth;
workerCanv.height = videoHeight;
const wcContext = workerCanv.getContext('2d');

const sendFrame = video => {
  wcContext.clearRect(0, 0, workerCanv.width, workerCanv.heigh);
  wcContext.drawImage(video, 0, 0);
  //console.log(workerCanv.toDataURL());
  myWorker.postMessage(
    wcContext.getImageData(0, 0, workerCanv.width, workerCanv.height)
  );
};

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available'
    );
  }

  //console.log('HELLO ARE YOU REBUILDING');

  const video = document.querySelector('video');
  player.on('startRecord', function() {
    video.addEventListener('timeupdate', () => sendFrame(video));
    detectPoseInRealTime(video);
  });

  //video.addEventListener("timeupdate", (event)=>console.log(event));
  // console.log("Theoretically, the video: ", video);
  video.width = videoWidth;
  video.height = videoHeight;

  //console.log('vid', video);
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: videoWidth,
      height: videoHeight
    }
  });
  // console.log('stream', stream);
  video.srcObject = stream;

  console.log('srcObj', video.srcObject);
  return new Promise(resolve => {
    video.onloadedmetadata = () => resolve(video);
  });
}

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

const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');
function detectPoseInRealTime(video) {
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  async function poseDetectionFrame() {
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    //draw the video onto the canvas from streaming webcam
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-videoWidth, 0);
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    ctx.restore();

    // loop through each pose and overlay wireframe skeleton
    // poses.forEach(({score, keypoints}) => {
    //   // if (score >= minPoseConfidence) {
    //   //   if (poseNetConfig.output.showPoints) {
    //   drawKeypoints(keypoints, minPartConfidence, ctx);
    //   drawSkeleton(keypoints, minPartConfidence, ctx);
    //   // }
    //   // }
    // });
    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

async function init() {
  // We load the model.

  myWorker = new Worker('nnworker.js');

  myWorker.onmessage = mess => {
    messages.push(mess.data);
    drawKeypoints(mess.data.keypoints, 0.1, ctx);
    drawSkeleton(mess.data.keypoints, 0.5, ctx);
    // console.log(messages);
  };
  let video;

  try {
    console.log('init');
    video = await setupCamera();
    console.log('is the camera set up');
    video.play();
  } catch (e) {
    throw e;
  }

  //  detectPoseInRealTime(video, net);
}

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

init();
