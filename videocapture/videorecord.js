import {sendFrame, detectPoseInRealTime} from '../brain/posenet2';
import videoJsOptions from '../utils/videoJsOptions';

var options = {
  controls: true,
  width: videoJsOptions.width,
  height: videoJsOptions.height,
  fluid: false,
  controlBar: {
    volumePanel: false
  },
  plugins: {
    record: {
      audio: true,
      video: true,
      maxLength: 10,
      timeSlice: videoJsOptions.plugins.record.timeSlice, //necessary for timestamp
      debug: true
    }
  }
};

let recordedData = {name: 'empty'};
const video = document.querySelector('video');
// apply some workarounds for certain browsers
// applyVideoWorkaround();

export const player = videojs('video', options, function() {
  // print version information at startup
  var msg =
    'Using video.js ' +
    videojs.VERSION +
    ' with videojs-record ' +
    videojs.getPluginVersion('record') +
    ' and recordrtc ' +
    RecordRTC.version;
  videojs.log(msg);
});

// error handling
player.on('deviceError', function() {
  console.warn('device error:', player.deviceErrorCode);
});

player.on('error', function(element, error) {
  console.error(error);
});

// user clicked the record button and started recording
player.on('startRecord', function() {
  console.log('started recording!');

  detectPoseInRealTime(video);
});

// player.on('progressRecord', function() {
//   console.log('currently recording', player.record().getDuration());
// });

player.on('timestamp', function() {
  console.log('currently recording', player.currentTimestamp);
  sendFrame(video);
});

// user completed recording and stream is available
player.on('finishRecord', function() {
  // the blob object contains the recorded data that
  // can be downloaded by the user, stored on server etc.

  console.log('finished recording: ', player.recordedData);
  recordedData = player.recordedData;
});

function upload() {
  var serverUrl = 'https://api.cloudinary.com/v1_1/braindance/video/upload';
  var data = recordedData;
  var formData = new FormData();
  formData.append('file', data, data.name);
  formData.append('upload_preset', 'acrhvgee');
  console.log('upload recording ' + data.name + ' to ' + serverUrl);
  // start upload
  fetch(serverUrl, {
    method: 'POST',
    body: formData
  })
    .then(success => console.log('upload recording complete.'))
    .catch(error => console.error('an upload error occurred!', error));
}

const uploadButton = document.getElementById('upload');
uploadButton.addEventListener('click', () => {
  upload();
});

function download() {
  player.record().saveAs({video: 'video-name.webm'});
}

const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', () => {
  download();
});
