import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import {addPracticeThunk} from '../store';

import setupCamera from '../../utils/setupCamera';
import videoJsOptions from '../../utils/videoJsOptions';

import videojs from 'video.js';
import RecordRTC from 'recordrtc';
import * as Record from 'videojs-record';
import 'webrtc-adapter';

import {Button, Segment, Card, Form, Message, Modal} from 'semantic-ui-react';

import Calibrator from './Calibrator';

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
      modalOpen: true
    };
    this.teamId = props.match.params.teamId;
    this.routineId = props.match.params.routineId;
    this.upload = this.upload.bind(this);
    this.download = this.download.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.setCalibration = this.setCalibration.bind(this);
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

  render() {
    return (
      <div>
        <div>
          <Modal open={this.state.modalOpen}>
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
          >
            <source
              src="https://res.cloudinary.com/braindance/video/upload/v1574713680/yu1eqjego1oi8vajvlmr.mkv"
              type="video/webm"
            />
          </video>
          <video
            id="video"
            ref={node => (this.videoNode = node)}
            controls={true}
            autoPlay
            className="video-js vjs-default-skin"
          ></video>
        </div>
        <div id="skelliesAndForm">
          <canvas id="skeleton">this is a canvas</canvas>
          <Segment compact>
            <Form>
              <Form.Field>
                <label>Title</label>
                <input
                  value={this.state.title}
                  onChange={evt => {
                    this.setState({...this.state, title: evt.target.value});
                  }}
                />
              </Form.Field>
            </Form>
            <p>When you are ready, submit your video for processing!</p>
            <Button content="Submit" onClick={this.upload} />
            <Button content="Download" onClick={this.download} />
            {this.state.visible ? (
              <Message
                onDismiss={this.handleDismiss}
                header="Video submitted!"
                content="Video processing. Check back soon :)"
              />
            ) : (
              ''
            )}
          </Segment>
        </div>
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
    userId: state.user.id
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
