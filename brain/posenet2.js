import 'babel-polyfill';
// import tf from '@tensorflow/tfjs-node';
// import {posenet} from '@tensorflow-models/posenet';

const posenet = require('@tensorflow-models/posenet');
let myWorker;
let messages=[];
const videoWidth = 360;
const videoHeight = 240;
const workerCanv=document.createElement('canvas');
workerCanv.width=videoWidth;
workerCanv.height=videoHeight;
const wcContext=workerCanv.getContext('2d');

const sendFrame=video=>{
  wcContext.clearRect(0, 0, workerCanv.width, workerCanv.heigh);
  wcContext.drawImage(video, 0, 0);
  //console.log(workerCanv.toDataURL());
  myWorker.postMessage(wcContext.getImageData(0, 0, workerCanv.width, workerCanv.height))
}

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available'
    );
  }


  //console.log('HELLO ARE YOU REBUILDING');

  const video = document.querySelector('video');
  video.addEventListener('timeupdate', ()=>sendFrame(video));
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
  console.log('stream', stream);
  video.srcObject = stream;

  console.log('srcObj', video.srcObject);
  return new Promise(resolve => {
    video.onloadedmetadata = () => resolve(video);
  });
}

let net;

let poseNetConfig = {
  algorithm: 'single-pose', //two options: single-pose or multi-pose
  input: {
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: {width: 360, height: 240},
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
function getPoseForWorker(){

}



/*function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  

  const otherCanvas=document.querySelector('.video-js canvas');
  otherCanvas.width = videoWidth;
  otherCanvas.height = videoHeight;
  const currctx=otherCanvas.getContext('2d');
  console.log(video);
  currctx.drawImage(video, 0, 0)
  myWorker.postMessage(currctx.getImageData(0, 0, otherCanvas.width, otherCanvas.height));
  //console.log("My video has", Object.getPrototypeOf(video));
  //myWorker.postMessage("Attempting to send data to worker");
  //myWorker.postMessage(canvas.toBlob());
  
  // since images are being fed from a webcam, we want to feed in the
  // original image and then just flip the keypoints' x coordinates. If instead
  // we flip the image, then correcting left-right keypoint pairs requires a
  // permutation on all the keypoints.
  const flipPoseHorizontal = true;

  //ctx.toBlob(myWorker.postMessage)
  //let temp=ctx.getImageData(0, 0, canvas.width, canvas.height);
  //myWorker.postMessage(temp.data);
  //requestAnimationFrame(detectPoseInRealTime);
}
  /*
  async function poseDetectionFrame() {
    /*let poses = [];
    let minPoseConfidence;
    let minPartConfidence;

    switch (poseNetConfig.algorithm) {
      case 'single-pose':
        
        poses = poses.concat(pose);
        // console.log('TCL: poseDetectionFrame -> poses', poses);
        minPoseConfidence = +poseNetConfig.singlePoseDetection
          .minPoseConfidence;
        minPartConfidence = +poseNetConfig.singlePoseDetection
          .minPartConfidence;
        break;
    }

    ctx.clearRect(0, 0, videoWidth, videoHeight);

    //draw the video onto the canvas from streaming webcam
    if (poseNetConfig.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();
    }
    
    // loop through each pose and overlay wireframe skeleton
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        if (poseNetConfig.output.showPoints) {
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
    // requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}*/

async function init() {
  // We load the model.
    
   myWorker=new Worker('nnworker.js');
   let count=1;
   myWorker.onmessage=(mess)=>{
     messages.push(mess.data);
     console.log(messages);
   }
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
