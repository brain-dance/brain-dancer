import React, {useState} from 'react';
// import VideoPlayer from 'react-video-js-player';
import videojs from 'video.js';
import RecordRTC from 'recordrtc';

import * as Record from 'videojs-record';
import 'webrtc-adapter';
import PrevAttempts from './PrevAttempts';

import {Button} from 'semantic-ui-react';

class RecordPerformance extends React.Component {
  constructor(props) {
    super(props);
    this.recordedData = {name: 'empty'};
    this.setupCamera = this.setupCamera.bind(this);
    this.upload = this.upload.bind(this);
    this.download = this.download.bind(this);
    this.videoWidth = 360;
    this.videoHeight = 210;
    this.videoNode = document.querySelector('#video');
    this.videoJsOptions = {
      controls: true,
      width: 320,
      height: 240,
      fluid: false,
      controlBar: {
        volumePanel: false
      },
      plugins: {
        record: {
          audio: true,
          video: true,
          maxLength: 10,
          timeSlice: 1000, //necessary for timestamp
          debug: true
        }
      }
    };
    //trying to attach to state
    this.state = {
      recording: []
    };
  }

  componentDidMount() {
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

    // this.player.on('timestamp', function() {
    //   console.log('currently recording', this.player.currentTimestamp); // *** timestamp doesn't show up but the interval seems correct
    //   // sendFrame(video);
    // });

    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      // the blob object contains the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', this.player.recordedData);
      this.recordedData = this.player.recordedData;
      this.setState(state => {
        return {recording: [...state.recording, this.recordedData]};
      });
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

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: this.videoWidth,
        height: this.videoHeight
      }
    });
    this.videoNode.srcObject = stream;

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

  upload() {
    const serverUrl = 'https://api.cloudinary.com/v1_1/braindance/video/upload';
    var data = this.recordedData;
    var formData = new FormData();
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

  download() {
    this.player.record().saveAs({video: 'video-name.webm'});
  }
  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div>
        <video
          id="video"
          ref={node => (this.videoNode = node)}
          controls={true}
          autoPlay
          // poster
          className="video-js vjs-default-skin"
        ></video>
        <Button content="Upload" onClick={this.upload} />
        <Button content="Download" onClick={this.download} />
        <br />
        <PrevAttempts
          recording={this.state.recording}
          recordedData={this.recordedData}
        />
      </div>
    );
  }
}

// use correct video mimetype for opera
if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
  this.videoJsOptions.plugins.record.videoMimeType = 'video/webm;codecs=vp8'; // or vp9
}

export default RecordPerformance;
