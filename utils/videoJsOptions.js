/* ********************
  This object contains the config and options needed to set up videoJS.
  the record plugin is what we use to record videos on Coreo. We set the
  video max length to be 10 seconds, and timeSlice to be 250ms. We need the
  timeSlice to be set so that videoJS will fire a timestamp at that set interval,
  and therefore afford us a way to capture the image and send it to our web worker for processing. At the time of this writing, we aren't able to get the timeSlice
  smaller than around 250 without crashing the player...
  ******************** */

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
      videoMimeType: 'video/mp4'
      //convertEngine: 'ffmpeg.js',
      // convertOptions: []
    }
  }
};

module.exports = videoJsOptions;
