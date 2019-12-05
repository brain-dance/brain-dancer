// import React, {useEffect, useState} from 'react';
// import videojs from 'video.js';
// import {drawSkeleton} from '../../frontUtils/draw';

// import webrtc_adapter from 'webrtc-adapter';
// import 'videojs-record/dist/videojs.record.js';

// import 'video.js/dist/video-js.css';
// import 'video.js/dist/video-js.min.css';
// import 'videojs-record/dist/css/videojs.record.css';
// import 'videojs-record/dist/css/videojs.record.min.css';

// import MyWorker from '../workers/videoNet.worker.js';

// const worker = new MyWorker();
// worker.postMessage({resolution: {width: 320, height: 240}});

// worker.onmessage = event => {
//   const canvas = document.querySelector('canvas');
//   const ctx = canvas.getContext('2d');
//   drawSkeleton(event.data.keypoints, 0, ctx);
// };

// const Test = props => {
//   const [camera, setCamera] = useState({});
//   let videoPlayer = React.createRef();

//   const options = {
//     controls: true,
//     width: 320,
//     height: 240,
//     fluid: false,
//     controlBar: {
//       volumePanel: false,
//       fullscreenToggle: false,
//       deviceButton: false,
//       recordIndicator: false,
//       cameraButton: false
//     },
//     plugins: {
//       record: {
//         image: true,
//         debug: true
//       }
//     }
//   };

//   useEffect(() => {
//     const player = videojs(videoPlayer, options, () => {
//       let msg =
//         'Using video.js ' +
//         videojs.VERSION +
//         ' with videojs-record ' +
//         videojs.getPluginVersion('record');
//       videojs.log(msg);
//     });

//     // error handling
//     console.log(player);
//     player.on('deviceError', function() {
//       console.warn('device error:', player.deviceErrorCode);
//     });
//     player.on('error', function(element, error) {
//       console.error(error);
//     });

//     // snapshot is available
//     player.on('finishRecord', function() {
//       const canvas = document.querySelector('canvas');
//       const ctx = canvas.getContext('2d');
//       worker.postMessage({image: ctx.getImageData(0, 0, 320, 240)});
//     });

//     player.on('retry', function() {
//       console.log('retry');
//     });
//     player.record().getDevice();
//     setCamera(player);
//   }, []);

//   const handleCapture = () => {
//     camera.record().start();
//   };

//   return (
//     <div id="test">
//       <video
//         id="myImage"
//         ref={node => (videoPlayer = node)}
//         className="video-js vjs-default-skin"
//       />
//       <button type="button" onClick={handleCapture}>
//         Take Picture
//       </button>
//       <img id="test" />
//     </div>
//   );
// };

// export default Test;
