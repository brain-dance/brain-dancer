import React, {Component} from 'react';
import VideoPlayer from 'react-video-js-player';
import videojs from 'video.js';
import RecordRTC from 'recordrtc';

// import record from 'videojs-record';

// import webrtc from 'webrtc';

//RESOURCES WHILE FIGURING OUT HOW TO STREAM
//https://github.com/collab-project/videojs-record/blob/master/examples/react/index.js
//https://www.npmjs.com/package/react-video-js-player
//VideoJS + React | https://github.com/collab-project/videojs-record/wiki/React

///SET UP WEBCAM THRU WEBCAM OR VIDEO PROCESSING
///LOOK UP REF
// class RecordPerformance extends Component {
//   constructor(props) {
//     super(props);
//     this.player = {};
//     this.record = {audio: true, video: true, maxLength: 10, debug: true};
//     this.state = {
//       video: {
//         url: '', //***should be stream?
//         status: ''
//       },
//       recordedData: {
//         name: 'empty'
//       }
//     };
//   }

//   async setupCamera() {
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       throw new Error(
//         'Browser API navigator.mediaDevices.getUserMedia not available'
//       );
//     }
//     //***actual camera setup?
//   }

//   componentDidMount() {
//     // if (!hasGetUserMedia()) {
//     //   alert('Your browser cannot stream from your webcam.');
//     //   return;
//     // }
//     // this.requestUserMedia();
//   }

//   onPlayerReady(player) {
//     console.log('Player is ready: ', player);
//     this.player = {...player};
//   }

//   onVideoPlay(duration) {
//     console.log('Video played at: ', duration);
//   }

//   onVideoPause(duration) {
//     console.log('Video paused at: ', duration);
//   }

//   // onVideoTimeUpdate(duration) {
//   //   console.log('Time updated: ', duration);
//   // }

//   // onVideoSeeking(duration) {
//   //   console.log('Video seeking: ', duration);
//   // }

//   // onVideoSeeked(from, to) {
//   //   console.log(`Video seeked from ${from} to ${to}`);
//   // }

//   // onVideoEnd() {
//   //   console.log('Video ended');
//   // }

//   onFinishRecord() {
//     this.setState({recordedData: this.player.recordedData});
//   }

//   upload() {
//     const serverUrl = 'https://api.cloudinary.com/v1_1/braindance/video/upload';
//     const data = this.state.recordedData;
//     const formData = new FormData();
//     formData.append('file', data, data.name);
//     formData.append('upload_preset', 'acrhvgee');
//     console.log('upload recording ' + data.name + ' to ' + serverUrl);
//     // start upload
//     fetch(serverUrl, {
//       method: 'POST',
//       body: formData
//     })
//       .then(success => console.log('upload recording complete.'))
//       .catch(error => console.error('an upload error occurred!', error));
//   }

//   render() {
//     return (
//       <div>
//         <VideoPlayer
//           controls={true}
//           // src={}
//           width="340"
//           height="210"
//           onReady={this.onPlayerReady.bind(this)}
//           onPlay={this.onVideoPlay.bind(this)}
//           onPause={this.onVideoPause.bind(this)}
//           // onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
//           // onSeeking={this.onVideoSeeking.bind(this)}
//           // onSeeked={this.onVideoSeeked.bind(this)}
//           // onEnd={this.onVideoEnd.bind(this)}
//           plugins={this.record}
//         />
//         <button type="submit">Upload Video</button>
//       </div>
//     );
//   }
// }

// const videoJsOptions = {
//   controls: true,
//   width: 340,
//   height: 210,
//   fluid: false,
//   plugins: {
//     record: {
//       audio: true,
//       video: true,
//       maxLength: 10,
//       debug: true
//     }
//   }
// };

// // use correct video mimetype for opera
// if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
//   videoJsOptions.plugins.record.videoMimeType = 'video/webm;codecs=vp8'; // or vp9
// }

// export default RecordPerformance;

class RecordPerformance extends React.Component {
  constructor(props) {
    super(props);
    this.recordedData = {name: 'empty'};
    this.setupCamera = this.setupCamera.bind(this);
    this.videoWidth = 360;
    this.videoHeight = 210;
    this.videoNode = document.querySelector('#video');
    this.videoJsOptions = {
      controls: false,
      width: 320,
      height: 240,
      fluid: false,
      controlBar: {
        volumePanel: false
      }
      // plugins: {
      //   record: {
      //     audio: true,
      //     video: true,
      //     maxLength: 10,
      //     timeSlice: 1000, //necessary for timestamp
      //     debug: true
      //   }
      // }
    };
  }

  componentDidMount() {
    console.log('hi', this.videoNode);
    this.setupCamera();
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.videoJsOptions, () => {
      // print version information at startup
      var msg =
        'Using video.js ' +
        videojs.VERSION +
        ' with videojs-record ' +
        videojs.getPluginVersion('record') +
        ' and recordrtc ' +
        RecordRTC.version;
      videojs.log(msg);
    });

    // error handling
    this.player.on('deviceError', function() {
      console.warn('device error:', this.player.deviceErrorCode);
    });

    this.player.on('error', (element, error) => {
      console.error(error);
    });

    // device is ready
    this.player.on('deviceReady', () => {
      console.log('device is ready!');
    });

    // user clicked the record button and started recording
    this.player.on('startRecord', () => {
      console.log('started recording!');
    });

    // player.on('progressRecord', function() {
    //   console.log('currently recording', player.record().getDuration());
    // });

    this.player.on('timestamp', function() {
      console.log('currently recording', this.player.currentTimestamp);
      // sendFrame(video);
    });

    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      // the blob object contains the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', this.player.recordedData);
      this.recordedData = this.player.recordedData;
    });
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      );
    }

    // const video = document.querySelector('#video');
    this.videoNode.width = this.videoWidth;
    this.videoNode.height = this.videoHeight;

    // console.log('vid', video);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: this.videoWidth,
        height: this.videoHeight
      }
    });
    this.videoNode.srcObject = stream;
    // console.log('hi, this is stream', stream);

    return new Promise(resolve => {
      this.videoNode.onloadedmetadata = () => resolve(this.videoNode);
    });
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div data-vjs-player>
        <video
          id="video"
          ref={node => (this.videoNode = node)}
          autoPlay
          className="video-js vjs-default-skin"
        ></video>
      </div>
    );
  }
}

// use correct video mimetype for opera
if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
  videoJsOptions.plugins.record.videoMimeType = 'video/webm;codecs=vp8'; // or vp9
}

export default RecordPerformance;
