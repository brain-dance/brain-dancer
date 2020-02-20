const posenet = require('@tensorflow-models/posenet');
let allProcessed = [];
let poseNetConfig = {};
let net = {};
let calibration = {};

/* ********************
  When the webworker receives a message from RecordPractice, it is in an object
  with at least one key, data, which has an object value equaling the
  information sent from the React component.

  On the first message received, the data should include the resolution of the
  video recording. The webworker sets up poseNet config to have the appropriate
  resolution and sends a 'Ready' message back.
   ******************** */
self.onmessage = set => {
  if (set.data.resolution) {
    poseNetConfig = {
      algorithm: 'single-pose', //other option: multi-pose
      input: {
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: set.data.resolution,
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
    postMessage({type: 'Ready'});

    /* ********************
      Outside of the initial resolution message, three types of messages
        could be received:
      'calibration' - a single image is sent to be processed through PoseNet,
        to be stored and used to normalize dancer and choreographer skellies.
      (no type) - data stream of images from videoJS during recording, in which
        the dancer is performing. The web worker takes these images and runs
        them through PoseNet, saving them in an array called allProcessed
      'finished' - the dancer has finished recording! Web worker will send
        back the allProcessed array - which should include JSON objects of all
        processed image frames from the recorded video,
        and the calibration object
      ******************** */
    posenet.load(poseNetConfig.input).then(newNet => {
      net = newNet;
      postMessage({type: 'Ready'});
      self.onmessage = event => {
        if (event.data.type === 'finished') {
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
          // console.log('calibrating');
          net
            .estimateSinglePose(event.data.image, {
              flipHorizontal: false,
              decodingMethod: 'single-person'
            })
            .then(result => {
              calibration = result;
            })
            .catch(err => console.error('error while calibrating!', err));
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
            })
            .catch(err =>
              console.error(
                'Inside estimate single pose, error occurred: ',
                err
              )
            );
        } catch (err) {
          console.error('Error in web worker: ', err);
          console.error('event that threw this error was: ', event);
        }
      };
    });
  }
};
