import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {addPracticeThunk, getSingleRoutine, setSingleRoutine} from '../store';

import videoJsOptions from '../../utils/videoJsOptions';

import videojs from 'video.js';
import RecordRTC from 'recordrtc';
import * as Record from 'videojs-record';
import 'webrtc-adapter';

import {Button, Segment, Modal, Item, Grid, Header} from 'semantic-ui-react';

import Calibrator from './Calibrator';
import PrevAttempts from './PrevAttempts';

import {drawSkeleton, drawKeypoints} from '../../frontUtils/draw';
import MyWorker from '../workers/videoNet.worker.js';

//import {parseForReplay, timeChangeCallback} from '../../utils/scoring'
import scoringUtils from '../../utils/scoring';

console.log('TCC: ', scoringUtils);
const tGS = {};
tGS.LTU = -Infinity;
tGS.worker = new MyWorker();
tGS.worker.postMessage({resolution: {width: 1260, height: 720}});
// tGS.messages = [];
tGS.recording = true;
tGS.worker.onmessage = event => {
  console.log('Message received from worker: ', event);
  tGS.allProcessedFrames = scoringUtils.parseForReplay(
    event.data.data,
    tGS.routineFrames || event.data.data /*should be cws, but scope issue*/,
    {x: 315, y: 300}, //midpoint
    -1,
    200,
    num => {
      tGS.score = num;
    },
    event.data.calibration,
    tGS.routineCalibration.pose
  );
  const video = document.querySelector('#video_html5_api');
  video.addEventListener('play', () => {
    tGS.replayStart = Date.now();
  });

  video.addEventListener('timeupdate', event => {
    const canvas = document.querySelector('#skeleton');
    const ctx = canvas.getContext('2d');
    // console.log('Start time is', tGS.replayStart);
    scoringUtils.timeChangeCallback(
      Date.now() - tGS.replayStart,
      tGS.allProcessedFrames,
      ctx,
      630,
      360,
      200,
      tGS.LTU
    );
    tGS.LTU = Date.now() - tGS.replayStart;
  });
};

const workerCanv = document.createElement('canvas');
workerCanv.width = 630 * 2;
workerCanv.height = 360 * 2;
const wcContext = workerCanv.getContext('2d');
tGS.sendFrame = (video, timestamp) => {
  wcContext.clearRect(0, 0, workerCanv.width, workerCanv.height);
  wcContext.drawImage(video, 0, 0);

  tGS.worker.postMessage({
    image: wcContext.getImageData(0, 0, workerCanv.width, workerCanv.height),
    timestamp: timestamp
  });
};

class RecordPractice extends React.Component {
  constructor(props) {
    super(props);
    this.recordedData = {name: 'empty'};
    this.videoNode = document.querySelector('#video');
    this.playback = document.querySelector('#routine');
    this.replayCanv = React.createRef();
    this.player = '';
    this.state = {
      title: '',
      visible: false,
      calibration: {},
      modalOpen: true,
      cameraCanvas: '',
      context: '',
      worker: null,
      LTU: 0,
      recording: []
    };

    this.teamId = props.match.params.teamId;
    this.routineId = props.match.params.routineId;
    this.handleDelete = this.handleDelete.bind(this);
    this.setCalibration = this.setCalibration.bind(this);
    this.playboth = this.playboth.bind(this);
    this.drawBoth = this.drawBoth.bind(this);
  }

  componentDidMount() {
    this.props.fetchRoutine(this.routineId).then(() => {
      this.playbackPlayer = videojs(
        this.playback,
        {
          controls: true,
          width: 640,
          height: 360,
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
        tGS.sendFrame(
          document.querySelector('#video_html5_api'),
          this.currentTimestamp
        );
      });

      // user completed recording and stream is available
      this.player.on('finishRecord', () => {
        // the blob object contains the recorded data that
        // can be downloaded by the user, stored on server etc.
        tGS.worker.postMessage({type: 'finished'});
        tGS.recording = false;

        console.log('finished recording: ', this.player.recordedData);
        this.recordedData = this.player.recordedData;
        this.setState(state => {
          return {recording: [...state.recording, this.recordedData]};
        });
      });

      this.player.record().getDevice();
    });
  }

  componentWillUnmount() {
    this.player.dispose();
    this.props.clearRoutine();
  }
  componentDidUpdate() {
    if (this.props.routineFrames) {
      tGS.routineFrames = this.props.routineFrames;
    }
    if (this.props.routine.calibrationframe) {
      tGS.routineCalibration = this.props.routine.calibrationframe;
    }
  }
  upload() {
    this.props.addPractice(
      this.recordedData,
      this.state.title,
      this.routineId,
      this.props.userId,
      tGS.score
    );

    this.setState({...this.state, visible: true});
  }

  download() {
    this.player.record().saveAs({video: 'video-name.webm'});
  }

  handleDismiss() {
    this.setState({...this.state, visible: false});
  }

  handleDelete(e, {name}) {
    this.setState(state => {
      return {recording: state.recording.filter(blob => blob.name !== name)};
    });
  }

  setCalibration(calibration) {
    this.setState({...this.state, calibration, modalOpen: false});
    // worker send msg to worker
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 630;
    tempCanvas.height = 360;
    const tempContext = tempCanvas.getContext('2d');
    const newImage = document.createElement('img');
    newImage.src = calibration;
    newImage.decode().then(() => {
      tempContext.drawImage(newImage, 0, 0);
      tGS.worker.postMessage({
        type: 'calibration',
        image: tempContext.getImageData(0, 0, 630, 360)
      });
    });
  }

  playboth() {
    this.player.play();
    this.playbackPlayer.play();
  }

  drawBoth() {
    const canvas = document.querySelector('#skeleton');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 630, 360);
    // console.log('draw!');
    // not sure how to go about this specifically per frame
    // drawSkeleton(scored[i][0].keypoints, 0, ctx, 0.4, 'red');
    // drawKeypoints(scored[i][0].keypoints, 0, ctx, 0.4, 'red');
    // drawSkeleton(scored[i][1].keypoints, 0, ctx, 0.4, 'green');
    // drawKeypoints(scored[i][1].keypoints, 0, ctx, 0.4, 'green');
  }

  render() {
    return (
      <Segment>
        <Button
          primary
          as={Link}
          to={`/team/${this.teamId}/routine/${this.routineId}`}
          floated="left"
          //Do we want a left chevron icon here?
          labelPosition="left"
          icon="left chevron"
          content="Back to Routine"
        />
        <Header as="h2" floated="left">
          Record a Practice
        </Header>
        <br />
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
        <br />
        <div id="recording">
          <video
            id="routine"
            ref={node => (this.playback = node)}
            controls={true}
            className="video-js"
            // onTimeUpdate={this.drawBoth}
          >
            <source src={this.props.routine.url} type="video/mp4" />
          </video>
          <video
            id="video"
            ref={node => (this.videoNode = node)}
            controls={true}
            autoPlay
            className="video-js vjs-default-skin"
          />
        </div>
        <Grid column={1} centered>
          <Segment basic compact padded="very">
            <Item>
              <Item.Content>
                <canvas id="skeleton" ref={this.replayCanv}></canvas>
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
        <div id="gallery">
          <PrevAttempts
            recording={this.state.recording}
            handleDelete={this.handleDelete}
            teamId={this.teamId}
            userId={this.props.userId}
            calibration={this.state.calibration}
          />
        </div>
      </Segment>
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
    },
    async fetchRoutine(routineId) {
      await dispatch(getSingleRoutine(routineId));
    },
    clearRoutine() {
      dispatch(setSingleRoutine({}));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RecordPractice);
