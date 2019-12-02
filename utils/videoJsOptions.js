const videoJsOptions = {
  controls: true,
  width: 640,
  height: 360,
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
