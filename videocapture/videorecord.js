// const videojs = require('video.js');
// const RecordRTC = require('recordrtc');
// const videojsRecord = require()

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

var player = videojs('video', options, function() {
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

// player.on('progressRecord', function() {
//   console.log('currently recording', player.record().getCurrentTime());
// });

// player.on('timestamp', function() {
//   console.log('currently recording', player.record().getCurrentTime());
// });

// user completed recording and stream is available
player.on('finishRecord', function() {
  // the blob object contains the recorded data that
  // can be downloaded by the user, stored on server etc.
  // debugger;
  // player.record().saveAs({video: 'video-name.webm'});
  console.log('finished recording: ', player.recordedData);
  recordedData = player.recordedData;
  // var data = player.recordedData;
  // var serverUrl = 'https://api.cloudinary.com/v1_1/braindance/video/upload';
  // var formData = new FormData();
  // const timestamp = Date.now();
  // formData.append('file', data, data.name);
  // formData.append('upload_preset', 'acrhvgee');
  // // formData.append('api_key', '827834286977223');
  // // formData.append('timestamp', timestamp);
  // // formData.append('signature', `timestamp=${timestamp}`);

  // console.log('uploading recording:', formData.file);

  // fetch(serverUrl, {
  //   method: 'POST',
  //   body: formData
  // })
  //   .then(success => console.log('recording upload complete.'))
  //   .catch(error => console.error('an upload error occurred!'));
});

player.on('startConvert', function() {
  console.log('start convert');
});

player.on('finishConvert', function() {
  console.log('finish convert', player.convertedData);
});

function upload() {
  // this upload handler is served using webpack-dev-server for
  // this example, see build-config/fragments/dev.js
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
// uploadButton.onclick = upload();
