import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import {addPracticeThunk} from '../store';

import setupCamera from '../../utils/setupCamera';
import videoJsOptions from '../../utils/videoJsOptions';

import videojs from 'video.js';
import RecordRTC from 'recordrtc';
import * as Record from 'videojs-record';
import 'webrtc-adapter';

import {
  Button,
  Segment,
  Card,
  Form,
  Message,
  Modal,
  Item,
  Grid
} from 'semantic-ui-react';

import Calibrator from './Calibrator';

import {drawSkeleton, drawKeypoints} from '../../frontUtils/draw';
import MyWorker from '../workers/videoNet.worker.js';

const worker = new MyWorker();
worker.postMessage({resolution: {width: 320, height: 240}});

worker.onmessage = event => {
  const canvas = document.querySelector('#skeleton');
  const ctx = canvas.getContext('2d');
  // console.log('got message', event.data);
  ctx.clearRect(0, 0, 360, 240);
  drawSkeleton(event.data.keypoints, 0, ctx, 0.4);
  drawKeypoints(event.data.keypoints, 0, ctx, 0.4);
};

// const workerCanv = document.getElementById('skeleton');

const workerCanv = document.createElement('canvas');
workerCanv.width = 320 * 2;
workerCanv.height = 240 * 2;
const wcContext = workerCanv.getContext('2d');

export const sendFrame = video => {
  wcContext.clearRect(0, 0, workerCanv.width, workerCanv.height);
  wcContext.drawImage(video, 0, 0);
  // console.log(workerCanv.toDataURL());
  worker.postMessage({
    image: wcContext.getImageData(0, 0, workerCanv.width, workerCanv.height)
    // timestamp: timestamp
  });
};

class RecordPractice extends React.Component {
  constructor(props) {
    super(props);
    this.recordedData = {name: 'empty'};
    this.videoNode = document.querySelector('#video');
    this.playback = document.querySelector('#routine');

    this.player = '';
    this.state = {
      title: '',
      visible: false,
      calibration: {},
      modalOpen: true,
      cameraCanvas: '',
      context: ''
    };

    this.teamId = props.match.params.teamId;
    this.routineId = props.match.params.routineId;

    this.upload = this.upload.bind(this);
    this.download = this.download.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.setCalibration = this.setCalibration.bind(this);
    this.playboth = this.playboth.bind(this);
    this.drawBoth = this.drawBoth.bind(this);
    // this.cameraCanvas;
    // this.context;
  }

  componentDidMount() {
    setupCamera(this.videoNode);
    this.playbackPlayer = videojs(
      this.playback,
      {
        controls: true,
        width: 320,
        height: 240,
        playbackRates: [0.5, 1, 1.5, 2]
      },
      () => {
        videojs.log('playback screen is live!');
      }
    );
    this.player = videojs(this.videoNode, videoJsOptions, () => {
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

    const temp1 = document.querySelector('.vjs-record-canvas canvas');
    const temp2 = temp1.getContext('2d');
    // yeah... it's the canvas
    this.setState({
      cameraCanvas: temp1,
      context: temp2
    });
    // this.setState({context: this.state.cameraCanvas.getContext('2d')});

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

    // this.player.on('progressRecord', function() {
    //   console.log('currently recording', this.player.record().getDuration());
    // });

    this.player.on('timestamp', function() {
      // console.log('currently recording', this.player.currentTimestamp); // *** timestamp doesn't show up but the interval seems correct
      console.log('timestamp!');
      sendFrame(document.querySelector('#video_html5_api'));
      // worker.postMessage({
      //   image: document
      //     .querySelector('.vjs-record-canvas canvas')
      //     .getContext('2d')
      //     .getImageData(0, 0, 320, 240)
      // });
    });

    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      // the blob object contains the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', this.player.recordedData);
      this.recordedData = this.player.recordedData;
    });
    // return player.dispose();
  }

  upload() {
    this.props.addPractice(
      this.recordedData,
      this.state.title,
      this.routineId,
      this.props.userId
    );

    this.setState({...this.state, visible: true});
  }

  download() {
    this.player.record().saveAs({video: 'video-name.webm'});
  }

  handleDismiss() {
    this.setState({...this.state, visible: false});
  }

  setCalibration(calibration) {
    this.setState({...this.state, calibration, modalOpen: false});
  }

  playboth() {
    console.log('hi');
    this.player.play();
    this.playbackPlayer.play();
  }

  drawBoth() {
    const canvas = document.querySelector('#skeleton');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 360, 240);
    console.log('draw!');
    // not sure how to go about this specifically per frame
    // drawSkeleton(scored[i][0].keypoints, 0, ctx, 0.4, 'red');
    // drawKeypoints(scored[i][0].keypoints, 0, ctx, 0.4, 'red');
    // drawSkeleton(scored[i][1].keypoints, 0, ctx, 0.4, 'green');
    // drawKeypoints(scored[i][1].keypoints, 0, ctx, 0.4, 'green');
  }

  render() {
    return (
      <div>
        <div>
          <Modal dimmer="inverted" open={this.state.modalOpen}>
            <Modal.Content>
              <Calibrator
                calibration={this.state.calibration}
                setCalibration={this.setCalibration}
              />
            </Modal.Content>
          </Modal>
        </div>
        <div id="recording">
          <video
            id="routine"
            ref={node => (this.playback = node)}
            controls={true}
            className="video-js"
            onTimeUpdate={this.drawBoth}
          >
            <source src={this.props.routine.url} type="video/mp4" />
          </video>
          <video
            id="video"
            ref={node => (this.videoNode = node)}
            controls={true}
            autoPlay
            className="video-js vjs-default-skin"
          ></video>
        </div>
        <Grid column={1} centered>
          <Segment basic compact padded="very">
            <Item>
              <Item.Content>
                <canvas id="skeleton"></canvas>
              </Item.Content>
              <Item.Content verticalAlign="top">
                <Item.Header>
                  <Button
                    content="Play back"
                    onClick={this.playboth}
                    color="blue"
                  />
                </Item.Header>
              </Item.Content>
            </Item>
          </Segment>
        </Grid>
        <Segment id="gallery">
          <p>Video list could be here, maybe as cards?</p>
        </Segment>
      </div>
    );
  }
}

if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
  videoJsOptions.plugins.record.videoMimeType = 'video/webm;codecs=vp8'; // or vp9
}

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    routine: state.singleRoutine,
    routineFrames: state.singleRoutine.videoframes
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addPractice(recordedData, title, teamId, userId) {
      dispatch(addPracticeThunk(recordedData, title, teamId, userId));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RecordPractice);
