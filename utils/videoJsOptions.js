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
      timeSlice: 1000, //necessary for timestamp
      debug: true
    }
  }
};

module.exports = videoJsOptions;
