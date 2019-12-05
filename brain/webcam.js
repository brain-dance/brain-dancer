// import 'babel-polyfill';

// //height slightly shorter to accommodate control bar for recording
// const videoWidth = 360;
// const videoHeight = 210;

// async function setupCamera() {
//   if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//     throw new Error(
//       'Browser API navigator.mediaDevices.getUserMedia not available'
//     );
//   }

//   const video = document.querySelector('#video');
//   video.width = videoWidth;
//   video.height = videoHeight;

//   // console.log('vid', video);
//   const stream = await navigator.mediaDevices.getUserMedia({
//     audio: false,
//     video: {
//       width: videoWidth,
//       height: videoHeight
//     }
//   });
//   video.srcObject = stream;

//   return new Promise(resolve => {
//     video.onloadedmetadata = () => resolve(video);
//   });
// }

// let net;

// let config = {
//   output: {
//     showVideo: true,
//     showPoints: true
//   }
// };

// function detectPoseInRealTime(video, net) {
//   const canvas = document.getElementById('output');
//   const ctx = canvas.getContext('2d');

//   canvas.width = videoWidth;
//   canvas.height = videoHeight;

//   async function poseDetectionFrame() {
//     ctx.clearRect(0, 0, videoWidth, videoHeight);

//     //draw the video onto the canvas from streaming webcam
//     if (config.output.showVideo) {
//       ctx.save();
//       ctx.scale(-1, 1);
//       ctx.translate(-videoWidth, 0);
//       ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
//       ctx.restore();
//     }

//     requestAnimationFrame(poseDetectionFrame);
//   }
//   poseDetectionFrame();
// }

// async function init() {
//   let video;

//   try {
//     // console.log('init');
//     video = await setupCamera();
//     // console.log('camera is set up');
//     video.play();
//   } catch (e) {
//     throw e;
//   }

//   detectPoseInRealTime(video, net);
// }

// navigator.getUserMedia =
//   navigator.getUserMedia ||
//   navigator.webkitGetUserMedia ||
//   navigator.mozGetUserMedia;

// init();
