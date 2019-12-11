const posenet = require('@tensorflow-models/posenet');

const poses = [];

let poseNetConfig = {
  algorithm: 'single-pose', //two options: single-pose or multi-pose
  input: {
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: {width: 640, height: 480},
    multiplier: 1,
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
  // net: null
};

let net;
posenet
  .load({
    architecture: poseNetConfig.input.architecture,
    outputStride: poseNetConfig.input.outputStride,
    inputResolution: poseNetConfig.input.inputResolution,
    multiplier: poseNetConfig.input.multiplier,
    quantBytes: poseNetConfig.input.quantBytes
  })
  .then(result => {
    net = result;
    onmessage = event => {
      try {
        // let temp = new ImageData(event.data.data, 360);
        net
          .estimateSinglePose(event.data.image, {
            flipHorizontal: false,
            decodingMethod: 'single-person'
          })
          .then(result => {
            postMessage({pose: result, timestamp: event.data.timestamp});
          })
          .catch(err =>
            console.error('Inside estimate single pose, error occurred: ', err)
          );
        //postMessage(poses);
      } catch (err) {
        console.error('Error in web worker: ', err);
        console.error('event that threw this error was: ', event);
      }
    };
  });

/*onMessage=(video)=>{poses.push(net.estimateSinglePose(video, {
  flipHorizontal: flipPoseHorizontal,
  decodingMethod: 'single-person'
}));
postMessage(poses)}*/
