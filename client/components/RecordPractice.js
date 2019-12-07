import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {addPracticeThunk, getSingleRoutine, setSingleRoutine} from '../store';
import {
  Button,
  Segment,
  Message,
  Modal,
  Item,
  Grid,
  Header
} from 'semantic-ui-react';

import videojs from 'video.js';
//import RecordRTC from 'recordrtc';
import * as Record from 'videojs-record';
import 'webrtc-adapter';

import Calibrator from './Calibrator';
import PrevAttempts from './PrevAttempts';

import videoJsOptions from '../../utils/videoJsOptions';
import scoringUtils from '../../utils/scoring';
import {drawSkeleton, drawKeypoints} from '../../frontUtils/draw';
import MyWorker from '../workers/videoNet.worker.js';

//import {parseForReplay, timeChangeCallback} from '../../utils/scoring'

// console.log('TCC: ', scoringUtils);

//const tGS = {};
//tGS.LTU = -Infinity;

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
      //worker: null,
      //LTU: 0,
      recording: [],
      selected: '',
      attempts: {},
      userActionAllowed: false,
      count: 0
      //grade: 0,
      // allProcessedFrames: []
    };

    this.teamId = props.match.params.teamId;
    this.routineId = props.match.params.routineId;
    this.handleDelete = this.handleDelete.bind(this);
    this.setCalibration = this.setCalibration.bind(this);
    this.playboth = this.playboth.bind(this);
    this.drawBoth = this.drawBoth.bind(this);
    this.countdownRecord = this.countdownRecord.bind(this);
    this.playAndRecord = this.playAndRecord.bind(this);
  }

  componentDidMount() {
    this.worker = (thisCont => {
      let LTU = Infinity;
      let replayStart = 0;
      const worker = new MyWorker();
      worker.postMessage({
        resolution: {width: videoJsOptions.width, height: videoJsOptions.height}
      });
      // tGS.messages = [];

      worker.onmessage = event => {
        console.log('Message received from worker: ', event);
        //Make sure that the user can't take calibration pic until poseNet's ready
        if (event.data.type === 'Ready') {
          thisCont.setState({userActionAllowed: true});
          return;
        }
        const toSet = {};
        toSet.allProcessedFrames = scoringUtils.parseForReplay(
          event.data.data,
          thisCont.props.routineFrames || event.data.data,
          {x: videoJsOptions.width, y: videoJsOptions.height}, //midpoint
          -1,
          videoJsOptions.plugins.record.timeSlice,
          num => {
            //thisCont.setState({attempts:{...attempts, [event.data.name]: score:num});
            toSet.grade = num;
          },
          event.data.calibration,
          thisCont.props.routine.calibrationframe.pose
        );
        thisCont.setState({
          attempts: {...thisCont.state.attempts, [event.data.name]: toSet}
        });
        const video = document.querySelector('#video_html5_api');

        //BUG: SOMETIMES THIS GETS A BUG THAT SAYS CANNOT READ PROEPRTY ADDEVENTLISTENER OF NULL
        video.addEventListener('play', () => {
          //console.log("HELLO");
          replayStart = Date.now();
        });

        video.addEventListener('timeupdate', () => {
          if (thisCont.state.selected === event.data.name) {
            const canvas = document.querySelector('#skeleton');
            const ctx = canvas.getContext('2d');
            // console.log('Start time is', tGS.replayStart);
            // console.log("In time update event, thisCont is: ", thisCont);
            scoringUtils.timeChangeCallback(
              Date.now() - replayStart,
              thisCont.state.attempts[event.data.name].allProcessedFrames,
              ctx,
              videoJsOptions.width,
              videoJsOptions.height,
              videoJsOptions.plugins.record.timeSlice,
              LTU
            );
            LTU = Date.now() - replayStart;
          }
        });
      };
      return worker;
    })(this);
    this.props.fetchRoutine(this.routineId).then(() => {
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
      this.player = videojs(this.videoNode, videoJsOptions, () => {
        // print version information at startup
        var msg =
          'Using video.js ' +
          videojs.VERSION +
          ' with videojs-record ' +
          videojs.getPluginVersion('record');
          //RecordRTC.version;
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
        console.warn('device error:', this.deviceErrorCode);
      });

      this.player.on('error', (element, error) => {
        console.error(error);
      });

      // device is ready
      this.player.on('deviceReady', () => {
        console.log('device is ready!');
      });

      // user clicked the record button and started recording

      const forStart = (tC => {
        return () => tC.setState({selected: ''});
      })(this);
      this.player.on('startRecord', () => {
        forStart();
        console.log('started recording!');
      });

      // this.player.on('progressRecord', function() {
      //   console.log('currently recording', this.player.record().getDuration());
      // });
      const forTimestamp = (worker => {
        const workerCanv = document.createElement('canvas');
        workerCanv.width = videoJsOptions.width;
        workerCanv.height = videoJsOptions.height;
        const wcContext = workerCanv.getContext('2d');
        return (video, timestamp) => {
          wcContext.clearRect(0, 0, workerCanv.width, workerCanv.height);
          wcContext.drawImage(video, 0, 0);

          worker.postMessage({
            image: wcContext.getImageData(
              0,
              0,
              workerCanv.width,
              workerCanv.height
            ),
            timestamp: timestamp
          });
        };
      })(this.worker);
      this.player.on('timestamp', function() {
        forTimestamp(
          document.querySelector('#video_html5_api'),
          this.currentTimestamp
        );
      });

      // user completed recording and stream is available
      const forFinish = ((worker, tC) => {
        return name => {
          worker.postMessage({type: 'finished', name});
          tC.setState({selected: name});
        };
      })(this.worker, this);
      this.player.on('finishRecord', () => {
        // the blob object contains the recorded data that
        // can be downloaded by the user, stored on server etc.

        // tGS.recording = false;
        forFinish(this.player.recordedData.name);
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
    this.worker.terminate();
    this.player.dispose();
    this.props.clearRoutine();
  }
  componentDidUpdate() {
    /*if (this.props.routineFrames) {
      tGS.routineFrames = this.props.routineFrames;
    }
    if (this.props.routine.calibrationframe) {
      tGS.routineCalibration = this.props.routine.calibrationframe;
    }*/
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
    this.setState({...this.state, calibration, modalOpen: false});
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
    // console.log('draw!');
    // not sure how to go about this specifically per frame
    // drawSkeleton(scored[i][0].keypoints, 0, ctx, 0.4, 'red');
    // drawKeypoints(scored[i][0].keypoints, 0, ctx, 0.4, 'red');
    // drawSkeleton(scored[i][1].keypoints, 0, ctx, 0.4, 'green');
    // drawKeypoints(scored[i][1].keypoints, 0, ctx, 0.4, 'green');
  }

  countdownRecord() {
    // this.playbackPlayer.play();
    // this.player.record().start();
    console.log('hello!?!?');
    this.playAndRecord();
    // setTimeout(() => this.playAndRecord(), 2400);
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
            <canvas id="skeleton" ref={this.replayCanv}></canvas>
          </div>
        </div>
      </Segment>
    );
  }
}

if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
  //videoJsOptions.plugins.record.videoMimeType = 'video/webm;codecs=vp8'; // or vp9
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
