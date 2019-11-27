const videoJsOptions = {
  controls: true,
  width: 320,
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
      timeSlice: 200, //necessary for timestamp
      debug: true
      // convertEngine: 'ffmpeg.js',
      // convertOptions: []
    }
  }
};

module.exports = videoJsOptions;
