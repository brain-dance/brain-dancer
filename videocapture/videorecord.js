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
      debug: true
    }
  }
};

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

// user completed recording and stream is available
player.on('finishRecord', function() {
  // the blob object contains the recorded data that
  // can be downloaded by the user, stored on server etc.
  console.log('finished recording: ', player.recordedData);
});
