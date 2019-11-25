import React, {Component} from 'react';
import VideoPlayer from 'react-video-js-player';
import RecordRTC from 'recordrtc';
// import webrtc from 'webrtc';

//RESOURCES WHILE FIGURING OUT HOW TO STREAM
//https://github.com/collab-project/videojs-record/blob/master/examples/react/index.js
//https://www.npmjs.com/package/react-video-js-player
//VideoJS + React | https://github.com/collab-project/videojs-record/wiki/React

///SET UP WEBCAM THRU WEBCAM OR VIDEO PROCESSING
///LOOK UP REF
class RecordPerformance extends Component {
  constructor(props) {
    super(props);
    this.player = {};
    this.record = {audio: true, video: true, maxLength: 10, debug: true};
    this.state = {
      video: {
        url: '', //***should be stream?
        status: ''
      },
      recordedData: {
        name: 'empty'
      }
    };
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      );
    }
    //***actual camera setup?
  }

  componentDidMount() {
    // if (!hasGetUserMedia()) {
    //   alert('Your browser cannot stream from your webcam.');
    //   return;
    // }
    this.requestUserMedia();
  }

  onPlayerReady(player) {
    console.log('Player is ready: ', player);
    this.player = {...player};
  }

  onVideoPlay(duration) {
    console.log('Video played at: ', duration);
  }

  onVideoPause(duration) {
    console.log('Video paused at: ', duration);
  }

  // onVideoTimeUpdate(duration) {
  //   console.log('Time updated: ', duration);
  // }

  // onVideoSeeking(duration) {
  //   console.log('Video seeking: ', duration);
  // }

  // onVideoSeeked(from, to) {
  //   console.log(`Video seeked from ${from} to ${to}`);
  // }

  // onVideoEnd() {
  //   console.log('Video ended');
  // }

  onFinishRecord() {
    this.setState({recordedData: this.player.recordedData});
  }

  upload() {
    const serverUrl = 'https://api.cloudinary.com/v1_1/braindance/video/upload';
    const data = this.state.recordedData;
    const formData = new FormData();
    formData.append('file', data, data.name);
    formData.append('upload_preset', 'acrhvgee');
    console.log('upload recording ' + data.name + ' to ' + serverUrl);
    // start upload
    fetch(serverUrl, {
      method: 'POST',
      body: formData
    })
      .then(success => console.log('upload recording complete.'))
      .catch(error => console.error('an upload error occurred!', error));
  }

  render() {
    return (
      <div>
        <p>Hi!</p>
        <VideoPlayer
          controls={true}
          // src={}
          width="340"
          height="210"
          onReady={this.onPlayerReady.bind(this)}
          onPlay={this.onVideoPlay.bind(this)}
          onPause={this.onVideoPause.bind(this)}
          // onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
          // onSeeking={this.onVideoSeeking.bind(this)}
          // onSeeked={this.onVideoSeeked.bind(this)}
          // onEnd={this.onVideoEnd.bind(this)}
          plugins={this.record}
        />
        <button type="submit">Upload Video</button>
      </div>
    );
  }
}

const videoJsOptions = {
  controls: true,
  width: 340,
  height: 210,
  fluid: false,
  plugins: {
    record: {
      audio: true,
      video: true,
      maxLength: 10,
      debug: true
    }
  }
};

// use correct video mimetype for opera
if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
  videoJsOptions.plugins.record.videoMimeType = 'video/webm;codecs=vp8'; // or vp9
}

export default RecordPerformance;
