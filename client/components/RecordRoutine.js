import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {addRoutineThunk} from '../store';

import setupCamera from '../../utils/setupCamera';
import videoJsOptions from '../../utils/videoJsOptions';

import videojs from 'video.js';
import RecordRTC from 'recordrtc';
import * as Record from 'videojs-record';
import 'webrtc-adapter';

import {Button, Segment, Card, Form, Message} from 'semantic-ui-react';

import Calibrator from './Calibrator';

const RecordRoutine = function(props) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [visible, setVisibility] = useState(false);
  const [calibration, setCalibration] = useState({});

  // const teamId = useSelector(state=>state.teamId)
  const teamId = 1; // update with above ^ when teamId is queried in order to get to this page
  const userId = useSelector(state => state.user.id);

  let recordedData = {name: 'empty'};

  let videoNode = document.querySelector('#video');
  let player;

  useEffect(() => {
    setupCamera(videoNode);
    player = videojs(videoNode, videoJsOptions, () => {
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
    player.on('deviceError', function() {
      console.warn('device error:', player.deviceErrorCode);
    });

    player.on('error', (element, error) => {
      console.error(error);
    });

    // device is ready
    player.on('deviceReady', () => {
      console.log('device is ready!');
    });

    // user clicked the record button and started recording
    player.on('startRecord', () => {
      console.log('started recording!');
    });

    // player.on('progressRecord', function() {
    //   console.log('currently recording', player.record().getDuration());
    // });

    // player.on('timestamp', function() {
    //   console.log('currently recording', player.currentTimestamp); // *** timestamp doesn't show up but the interval seems correct
    //   // sendFrame(video);
    // });

    // user completed recording and stream is available
    player.on('finishRecord', () => {
      // the blob object contains the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', player.recordedData);
      recordedData = player.recordedData;
    });
    // return player.dispose();
  }, [videoNode]);

  const upload = () => {
    dispatch(addRoutineThunk(recordedData, title, teamId, userId));
    //after a few seconds, or like a loading screen
    // submission received!
    // please check back shortly!
    //we will email you
    //redirect to routine page
    setVisibility(true);
  };

  const download = () => {
    player.record().saveAs({video: 'video-name.webm'});
  };

  const handleDismiss = () => {
    setVisibility(false);
  };
  return (
    <div>
      {Object.keys(calibration).length ? (
        ''
      ) : (
        <Calibrator calibration={calibration} setCalibration={setCalibration} />
      )}
      <div id="recording">
        <video
          id="video"
          ref={node => (videoNode = node)}
          controls={true}
          autoPlay
          className="video-js vjs-default-skin"
        ></video>
        <Segment compact>
          <Form>
            <Form.Field>
              <label>Title</label>
              <input
                value={title}
                onChange={evt => setTitle(evt.target.value)}
              />
            </Form.Field>
          </Form>
          <p>When you are ready, submit your video for processing!</p>
          <Button content="Submit" onClick={upload} />
          <Button content="Download" onClick={download} />
          {visible ? (
            <Message
              onDismiss={handleDismiss}
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
};

if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
  videoJsOptions.plugins.record.videoMimeType = 'video/webm;codecs=vp8'; // or vp9
}

export default RecordRoutine;
