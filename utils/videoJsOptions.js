const videoJsOptions = {
  controls: false, //true,
  width: 640,
  height: 480,
  fluid: false,
  controlBar: {
    volumePanel: false
  },
  plugins: {
    record: {
      audio: false,
      video: true,
      maxLength: 10,
      timeSlice: 250, //necessary for timestamp
      debug: false,
      videoMimeType: "video/mp4",
      //convertEngine: 'ffmpeg.js',
      // convertOptions: []
    }
  }
};

module.exports = videoJsOptions;
