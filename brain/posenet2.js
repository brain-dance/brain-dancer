import 'babel-polyfill';
// import tf from '@tensorflow/tfjs-node';
// import {posenet} from '@tensorflow-models/posenet';
// const posenet = require('@tensorflow-models/posenet');

const videoWidth = 360;
const videoHeight = 210;

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available'
    );
  }

  const video = document.querySelector('#video');
  video.width = videoWidth;
  video.height = videoHeight;

  console.log('vid', video);
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
  // algorithm: 'single-pose', //two options: single-pose or multi-pose
  // input: {
  //   architecture: 'MobileNetV1',
  //   outputStride: 16,
  //   inputResolution: {width: 360, height: 240},
  //   multiplier: 1,
  //   quantBytes: 2
  // },
  // singlePoseDetection: {
  //   minPoseConfidence: 0.1,
  //   minPartConfidence: 0.5
  // },
  output: {
    showVideo: true,
    showPoints: true
  }
  // net: null
};

function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  // since images are being fed from a webcam, we want to feed in the
  // original image and then just flip the keypoints' x coordinates. If instead
  // we flip the image, then correcting left-right keypoint pairs requires a
  // permutation on all the keypoints.

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  async function poseDetectionFrame() {
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    //draw the video onto the canvas from streaming webcam
    if (poseNetConfig.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();
    }

    requestAnimationFrame(poseDetectionFrame);
  }
  poseDetectionFrame();
}

async function init() {
  // We load the model.
  // net = await posenet.load({
  //   architecture: poseNetConfig.input.architecture,
  //   outputStride: poseNetConfig.input.outputStride,
  //   inputResolution: poseNetConfig.input.inputResolution,
  //   multiplier: poseNetConfig.input.multiplier,
  //   quantBytes: poseNetConfig.input.quantBytes
  // });
  // console.log(net);
  let video;

  try {
    // console.log('init');
    video = await setupCamera();
    console.log('camera is set up');
    video.play();
  } catch (e) {
    throw e;
  }

  detectPoseInRealTime(video, net);
}

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

init();
