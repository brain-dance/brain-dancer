const posenet = require('@tensorflow-models/posenet');
let allProcessed = [];
let poseNetConfig = {};
let net = {};
let calibration = {};

self.onmessage = set => {
  if (set.data.resolution) {
    poseNetConfig = {
      algorithm: 'single-pose', //other option: multi-pose
      input: {
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: {width: 640, height: 480},
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
      postMessage({type: 'Ready'});
      self.onmessage = event => {
        //console.log("In Worker, message received: ", event);
        if (event.data.type === 'finished') {
          console.log('Finishing?');
          postMessage({
            type: 'All processed',
            data: allProcessed,
            calibration: calibration,
            name: event.data.name
          });
          allProcessed = [];
          return;
        }
        if (event.data.type === 'calibration') {
          console.log('calibrating');
          net
            .estimateSinglePose(event.data.image, {
              flipHorizontal: false,
              decodingMethod: 'single-person'
            })
            .then(result => {
              calibration = result;
            })
            .catch(err => console.log('error while calibrating!', err));
          return;
        }
        try {
          net
            .estimateSinglePose(event.data.image, {
              flipHorizontal: false,
              decodingMethod: 'single-person'
            })
            .then(result => {
              allProcessed.push({
                pose: result,
                timestamp: event.data.timestamp
              });
              // console.log(allProcessed.length);
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
