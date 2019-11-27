const posenet = require('@tensorflow-models/posenet');

let poseNetConfig = {};
let net = {};

self.onmessage = set => {
  if (set.data.resolution) {
    poseNetConfig = {
      algorithm: 'single-pose', //other option: multi-pose
      input: {
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: set.resolution,
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
    posenet.load(poseNetConfig.input).then(newNet => {
      net = newNet;
      self.onmessage = event => {
        try {
          net
            .estimateSinglePose(event.data.image, {
              flipHorizontal: false,
              decodingMethod: 'single-person'
            })
            .then(result => {
              postMessage(result);
            })
            .catch(err =>
              console.log('Inside estimate single pose, error occurred: ', err)
            );
        } catch (err) {
          console.log('Error in web worker: ', err);
          console.log('event that threw this error was: ', event);
        }
      };
    });
  }
};
