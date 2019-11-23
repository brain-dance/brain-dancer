const posenet = require('@tensorflow-models/posenet');

console.log('NETWORKER INITIATING');

//init();
const poses = [];

let poseNetConfig = {
  algorithm: 'single-pose', //two options: single-pose or multi-pose
  input: {
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: {width: 360, height: 210},
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
    //console.log("LOADED")
    net = result;
    onmessage = event => {
      try {
        //console.log("MESSAGE RECEIVED");
        // console.log(event);
        // let temp = new ImageData(event.data.data, 360);
        console.log('nnworker', event.data.image);
        net
          .estimateSinglePose(event.data.image, {
            flipHorizontal: false,
            decodingMethod: 'single-person'
          })
          .then(result => {
            // console.log("NN result is", result);

            postMessage({pose: result, timestamp: event.data.timestamp});
          })
          .catch(err =>
            console.log('Inside estimate single pose, error occurred: ', err)
          );
        //console.log(poses.length)
        //postMessage(poses);
      } catch (err) {
        console.log('Error in web worker: ', err);
        console.log('event that threw this error was: ', event);
      }
    };
    console.log('READY');
  });

/*onMessage=(video)=>{poses.push(net.estimateSinglePose(video, {
  flipHorizontal: flipPoseHorizontal,
  decodingMethod: 'single-person'
}));
postMessage(poses)}*/
