// const setupCamera = async video => {
//   const videoWidth = 640;
//   const videoHeight = 480;

//   if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//     throw new Error(
//       'Browser API navigator.mediaDevices.getUserMedia not available'
//     );
//   }

//   // const video = document.querySelector('#video');
//   video.width = videoWidth;
//   video.height = videoHeight;

//   // console.log('vid', video);
//   const stream = await navigator.mediaDevices.getUserMedia({
//     audio: true,
//     video: {
//       width: videoWidth,
//       height: videoHeight
//     }
//   });
//   video.srcObject = stream;
//   // console.log('hi, is stream', stream);

//   return new Promise(resolve => {
//     video.onloadedmetadata = () => resolve(video);
//   });
// };

// module.exports = setupCamera;
