import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import {addRoutineThunk} from '../store';

import setupCamera from '../../utils/setupCamera';
import videoJsOptions from '../../utils/videoJsOptions';
import {stopWebcam} from '../../frontUtils/workarounds';

import videojs from 'video.js';
import RecordRTC from 'recordrtc';
import * as Record from 'videojs-record';
import 'webrtc-adapter';
import PrevAttempts from './PrevAttempts';

import {Header, Modal} from 'semantic-ui-react';

import Calibrator from './Calibrator';

class RecordRoutine extends React.Component {
  constructor(props) {
    super(props);
    this.recordedData = {name: 'empty'};
    this.videoNode = React.createRef();
    this.player = '';
    this.state = {
      calibration: {},
      recording: [],
      modalOpen: true
    };
    this.teamId = props.match.params.teamId;
    this.handleDelete = this.handleDelete.bind(this);
    this.setCalibration = this.setCalibration.bind(this);
  }

  componentDidMount() {
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

    this.player.record().getDevice();
    // this.player.on('startConvert', () => {});
    // this.player.on('finishConvert', () => {
    //   console.log('convert completed!', this.player.convertedData)
    // }); //player.convertedData
    // return player.dispose();
  }

  componentWillUnmount() {
    this.player.dispose();
  }

  handleDelete(e, {name}) {
    this.setState(state => {
      return {recording: state.recording.filter(blob => blob.name !== name)};
    });
  }

  setCalibration(calibration) {
    console.log('calibration', calibration);
    this.setState({...this.state, calibration, modalOpen: false});
  }

  render() {
    return (
      <div>
        <div>
          <Modal open={this.state.modalOpen} dimmer="inverted">
            <Modal.Content>
              <Calibrator
                calibration={this.state.calibration}
                setCalibration={this.setCalibration}
              />
            </Modal.Content>
          </Modal>
        </div>
        <Header as="h2">Record Your Routine</Header>
        <div id="recording" data-vjs-player>
          <video
            id="video"
            ref={node => (this.videoNode = node)}
            controls={true}
            autoPlay
            className="video-js vjs-default-skin"
          ></video>
        </div>
        <br />
        <div id="gallery">
          <PrevAttempts
            recording={this.state.recording}
            recordedData={this.state.recordedData}
            handleDelete={this.handleDelete}
            teamId={this.teamId}
            userId={this.props.userId}
            calibration={this.state.calibration}
          />
        </div>
      </div>
    );
  }
}

if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
  videoJsOptions.plugins.record.videoMimeType = 'video/webm;codecs=vp8'; // or vp9
}

const mapStateToProps = state => {
  return {
    userId: state.user.id
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addRoutine(recordedData, title, teamId, userId) {
      dispatch(addRoutineThunk(recordedData, title, teamId, userId));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RecordRoutine);
