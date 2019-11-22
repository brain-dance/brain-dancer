var options = {
  controls: true,
  width: 360,
  height: 240,
  fluid: false,
  controlBar: {
    volumePanel: false
  },
  plugins: {
    record: {
      audio: true,
      video: true,
      maxLength: 10,
      // timeSlice: 10, //necessary for timestamp
      debug: true
    }
  }
};

let recordedData = {name: 'empty'};

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
});

player.on('progressRecord', function() {
  console.log('currently recording', player.record().getDuration());
});

// player.on('timestamp', function() {
//   console.log('currently recording', player.record().getCurrentTime());
// });

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
    .catch(error => console.error('an upload error occurred!'));
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
