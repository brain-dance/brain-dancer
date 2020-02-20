import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

// redux thunks and react components
import {addPracticeThunk, getSingleRoutine, setSingleRoutine} from '../store';
import Calibrator from './Calibrator';
import PrevAttempts from './PrevAttempts';

// styling
import {Button, Segment, Message, Modal, Header} from 'semantic-ui-react';

// video and recording plugins
import videojs from 'video.js';
import RecordRTC from 'recordrtc';
import * as Record from 'videojs-record';
import 'webrtc-adapter';

// config and utils for posenet, scoring, drawing images/skellies
import videoJsOptions from '../../utils/videoJsOptions';
import scoringUtils from '../../utils/scoring';
import {drawSkeleton, drawKeypoints} from '../../frontUtils/draw';
import MyWorker from '../workers/videoNet.worker.js';

//import {parseForReplay, timeChangeCallback} from '../../utils/scoring'

//const tGS = {};
//tGS.LTU = -Infinity;

class RecordPractice extends React.Component {
  constructor(props) {
    super(props);
    this.recordedData = {name: 'empty'}; // will contain video recording
    this.videoNode = document.querySelector('#video'); // used to initialize videoJS
    this.playback = document.querySelector('#routine');
    this.replayCanv = React.createRef(); // canvas for skellies after recording
    this.cameraVideoTag = React.createRef(); // videoJS generates a separate canvas for their camera. We need to set a ref to this once it's mounted
    this.player = ''; // used by videoJS/record
    this.state = {
      title: '',
      visible: false,
      calibration: {},
      modalOpen: true,
      recording: [],
      selected: '',
      attempts: {},
      userActionAllowed: false,
      count: 0
    };

    /* ********************
    routing: match appropriate teamId and routineId per URI
       ******************** */
    this.teamId = props.match.params.teamId;
    this.routineId = props.match.params.routineId;

    this.handleDelete = this.handleDelete.bind(this);
    this.setCalibration = this.setCalibration.bind(this);
    this.playboth = this.playboth.bind(this);
    this.drawBoth = this.drawBoth.bind(this);
    this.countdownRecord = this.countdownRecord.bind(this);
    this.playAndRecord = this.playAndRecord.bind(this);
    this.createRecorder = this.createRecorder.bind(this);
    this.sendFrameToWorker = this.sendFrameToWorker.bind(this);
    this.createWorker = this.createWorker.bind(this);
    this.gotWorkerData = this.gotWorkerData.bind(this);
    this.createPlayback = this.createPlayback.bind(this);
    this.finishedRecording = this.finishedRecording.bind(this);
    this.manualUnmount = this.manualUnmount.bind(this);
  }

  componentDidMount() {
    //GET ROUTINE INFO
    this.props.fetchRoutine(this.routineId).then(() => {
      //SET UP PLAYBACK VIDEO PLAYER
      this.createPlayback();

      //CREATES VIDEO RECORDER
      this.createRecorder();

      //FIND VIDEOJS VIDEO ELEMENT
      this.cameraVideoTag = document.querySelector('#video_html5_api');

      // CREATE WEBWORKER
      this.createWorker();
    });

    // clear out worker, player, recordedData when leaving page
    window.addEventListener('beforeunload', this.manualUnmount);
  }

  createPlayback() {
    this.playbackPlayer = videojs(
      this.playback,
      {
        controls: true,
        width: videoJsOptions.width,
        height: videoJsOptions.height,
        playbackRates: [0.5, 1, 1.5, 2]
      },
      () => {
        videojs.log('playback screen is live!');
      }
    );
  }

  createRecorder() {
    //SET UP VIDEOJS RECORDER PLAYER
    this.player = videojs(this.videoNode, videoJsOptions);

    // error handling
    this.player.on('deviceError', function() {
      console.warn('device error:', this.player.deviceErrorCode);
    });

    this.player.on('error', (element, error) => {
      console.error(error);
    });

    // device is ready
    this.player.on('deviceReady', () => {});

    // user clicked the record button and started recording
    const forStart = () => this.setState({selected: ''});
    this.player.on('startRecord', forStart.bind(this));

    //SEND VIDEO FRAME TO WORKER ON TIMESTAMP
    const runTimestamp = () => {
      this.sendFrameToWorker(this.cameraVideoTag, this.player.currentTimestamp);
    };
    this.player.on('timestamp', runTimestamp.bind(this));

    // user completed recording and stream is available
    this.player.on('finishRecord', async () => {
      this.finishedRecording(await this.player.recordedData);
    });

    this.player.record().getDevice();
  }

  createWorker() {
    this.LTU = Infinity;
    this.replayStart = 0;

    this.worker = new MyWorker();
    this.worker.postMessage({
      resolution: {width: videoJsOptions.width, height: videoJsOptions.height}
    });

    this.workerCanvas = document.createElement('canvas');
    this.workerCanvas.width = videoJsOptions.width;
    this.workerCanvas.height = videoJsOptions.height;

    // HANDLE WHEN WORKER RECEIVES MESSAGE
    this.worker.onmessage = this.gotWorkerData;
  }

  gotWorkerData(event) {
    //Make sure that the user can't take calibration pic until poseNet's ready
    if (event.data.type === 'Ready') {
      this.setState({userActionAllowed: true});
      return;
    }

    //HANDLES WORKER PROCESSING
    const toSet = {};
    toSet.allProcessedFrames = scoringUtils.parseForReplay(
      event.data.data,
      this.props.routineFrames || event.data.data,
      {x: videoJsOptions.width, y: videoJsOptions.height}, //midpoint
      -1,
      videoJsOptions.plugins.record.timeSlice,
      num => {
        toSet.grade = num;
      },
      event.data.calibration,
      this.props.routine.calibrationframe.pose
    );
    this.setState(state => ({
      attempts: {...state.attempts, [event.data.name]: toSet}
    }));

    //FIND WHEN VIDEO STARTS PLAYING
    this.cameraVideoTag.addEventListener('play', () => {
      this.replayStart = Date.now();
    });

    //ON PLAYBACK FIND SKELETON CANVAS AND DRAW SKELETONS
    this.cameraVideoTag.addEventListener('timeupdate', () => {
      if (this.state.selected === event.data.name) {
        const ctx = this.replayCanv.current.getContext('2d');
        scoringUtils.timeChangeCallback(
          Date.now() - this.replayStart,
          this.state.attempts[event.data.name].allProcessedFrames,
          ctx,
          videoJsOptions.width,
          videoJsOptions.height,
          videoJsOptions.plugins.record.timeSlice,
          this.LTU
        );
        this.LTU = Date.now() - this.replayStart;
      }
    });
  }

  sendFrameToWorker(video, timestamp) {
    const wcContext = this.workerCanvas.getContext('2d');
    wcContext.clearRect(
      0,
      0,
      this.workerCanvas.width,
      this.workerCanvas.height
    );
    wcContext.drawImage(video, 0, 0);
    this.worker.postMessage({
      image: wcContext.getImageData(
        0,
        0,
        this.workerCanvas.width,
        this.workerCanvas.height
      ),
      timestamp: timestamp
    });
  }

  componentWillUnmount() {
    this.manualUnmount();
    window.removeEventListener('beforeunload', this.manualUnmount);
  }

  manualUnmount() {
    this.worker.terminate();
    this.player.dispose();
    this.props.clearRoutine();
  }

  componentDidUpdate() {
    document.querySelectorAll('canvas').forEach(el => {
      el.width = videoJsOptions.width;
      el.height = videoJsOptions.height;
    });
  }

  handleDelete(e, {name}) {
    this.setState(state => {
      return {recording: state.recording.filter(blob => blob.name !== name)};
    });
  }

  setCalibration(calibration) {
    this.setState(state => ({...state, calibration, modalOpen: false}));
    // worker send msg to worker
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = videoJsOptions.width;
    tempCanvas.height = videoJsOptions.height;
    const tempContext = tempCanvas.getContext('2d');
    const newImage = document.createElement('img');
    newImage.src = calibration;
    newImage.decode().then(() => {
      tempContext.drawImage(newImage, 0, 0);
      this.worker.postMessage({
        type: 'calibration',
        image: tempContext.getImageData(
          0,
          0,
          videoJsOptions.width,
          videoJsOptions.height
        )
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
    ctx.clearRect(0, 0, videoJsOptions.width, videoJsOptions.height);
    // not sure how to go about this specifically per frame
    // drawSkeleton(scored[i][0].keypoints, 0, ctx, 0.4, 'red');
    // drawKeypoints(scored[i][0].keypoints, 0, ctx, 0.4, 'red');
    // drawSkeleton(scored[i][1].keypoints, 0, ctx, 0.4, 'green');
    // drawKeypoints(scored[i][1].keypoints, 0, ctx, 0.4, 'green');
  }

  countdownRecord() {
    this.playAndRecord();
  }

  finishedRecording(recordedData) {
    this.recordedData = recordedData;
    this.worker.postMessage({type: 'finished', name: recordedData.name});
    this.setState(state => ({
      selected: recordedData.name,
      recording: [...state.recording, this.recordedData]
    }));
  }

  playAndRecord() {
    this.playbackPlayer.play();
    this.player.record().start();
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
              {this.state.userActionAllowed ? (
                <Calibrator
                  calibration={this.state.calibration}
                  setCalibration={this.setCalibration}
                />
              ) : (
                <Message>Camera warming up. You should warm up, too!</Message>
              )}
            </Modal.Content>
          </Modal>
        </div>
        <br />
        <div id="recording">
          <div>
            <video
              id="routine"
              ref={node => (this.playback = node)}
              controls={true}
              className="video-js"
              // onTimeUpdate={this.drawBoth}
            >
              <source src={this.props.routine.url} type="video/mp4" />
            </video>
            <Button content="Play back" onClick={this.playboth} color="blue" />
            <Button
              color="red"
              floated="right"
              content={`Record ${this.state.count > 0 ? this.state.count : ''}`}
              onClick={this.countdownRecord}
            />
            <div id="gallery">
              <PrevAttempts
                recording={this.state.recording}
                handleDelete={this.handleDelete}
                teamId={this.teamId}
                userId={this.props.userId}
                calibration={this.state.calibration}
                attempts={this.state.attempts}
              />
            </div>
          </div>
          <div>
            <video
              id="video"
              ref={node => (this.videoNode = node)}
              controls={true}
              autoPlay
              className="video-js vjs-default-skin"
            />
            <canvas id="skeleton" ref={this.replayCanv} />
          </div>
        </div>
      </Segment>
    );
  }
}

// if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
//videoJsOptions.plugins.record.videoMimeType = 'video/webm;codecs=vp8'; // or vp9
// }

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
