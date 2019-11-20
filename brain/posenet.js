import posenet from '@tensorflow-models/posenet';

const videoWidth = window.innerWidth || 640;
const videoHeight = window.innerHeight || 360;

export let handsKeyPoints;
export let leftHandPosition;
export let rightHandPosition;

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available'
    );
  }

  const video = document.getElementById('video');
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
  algorithm: 'single-pose', //other option: multi-pose
  input: {
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: {width: 640, height: 360},
    multiplier: 0.75,
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

function getLeftHand(keypoints) {
  for (var i = 0; i < keypoints.length; i++) {
    if (keypoints[i].part === 'leftWrist') {
      return keypoints[i].position;
    }
  }
}

function getRightHand(keypoints) {
  for (var i = 0; i < keypoints.length; i++) {
    if (keypoints[i].part === 'rightWrist') {
      return keypoints[i].position;
    }
  }
}

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

  async function poseDetectionFrame() {
    let poses = [];
    let minPoseConfidence;
    let minPartConfidence;

    switch (poseNetConfig.algorithm) {
      case 'single-pose':
        const pose = await net.estimatePoses(video, {
          flipHorizontal: flipPoseHorizontal,
          decodingMethod: 'single-person'
        });
        poses = poses.concat(pose);
        minPoseConfidence = +poseNetConfig.singlePoseDetection
          .minPoseConfidence;
        minPartConfidence = +poseNetConfig.singlePoseDetection
          .minPartConfidence;
        break;
    }

    ctx.clearRect(0, 0, videoWidth, videoHeight);

    if (poseNetConfig.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();
    }

    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        if (poseNetConfig.output.showPoints) {
          handsKeyPoints = keypoints;
          leftHandPosition = getLeftHand(keypoints);
          rightHandPosition = getRightHand(keypoints);
        }
      }
    });

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

export async function init() {
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
}

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

// console.log(net);
init();
