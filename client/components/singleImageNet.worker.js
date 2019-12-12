const posenet = require('@tensorflow-models/posenet');

const init = () => {
  let poseNetConfig = {
    algorithm: 'single-pose', //other option: multi-pose
    input: {
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: {width: 320, height: 240},
      multiplier: 0.75,
      quantBytes: 2
    },
    singlePoseDetection: {
      minPoseConfidence: 0.1,
      minPartConfidence: 0.5
    },
    output: {
      showVideo: true,
      showPoints: true
    }
  };

  posenet.load(poseNetConfig).then(net => {
    self.onmessage = event => {
      try {
        net
          .estimateSinglePose(event.data, {
            flipHorizontal: false,
            decodingMethod: 'single-person'
          })
          .then(result => {
            postMessage(result);
          })
          .catch(err =>
            console.error('Inside estimate single pose, error occurred: ', err)
          );
      } catch (err) {
        console.error('Error in web worker: ', err);
        // console.error('Event that threw this error was: ', event);
      }
    };
  });
};

init();
