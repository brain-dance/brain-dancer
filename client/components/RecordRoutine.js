import React, {useState, useEffect} from 'react';

import setupCamera from '../../utils/setupCamera';
import videoJsOptions from '../../utils/videoJsOptions';

import videojs from 'video.js';
import RecordRTC from 'recordrtc';
import * as Record from 'videojs-record';
import 'webrtc-adapter';

import {Button, Segment} from 'semantic-ui-react';

const RecordRoutine = function(props) {
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
    //stuff to put in POST route, then dispatch thunk here ;)
    const serverUrl = 'https://api.cloudinary.com/v1_1/braindance/video/upload';
    var data = recordedData;
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
  };

  const download = () => {
    player.record().saveAs({video: 'video-name.webm'});
  };

  return (
    <div>
      <video
        id="video"
        ref={node => (videoNode = node)}
        controls={true}
        autoPlay
        className="video-js vjs-default-skin"
      >
        hello
      </video>
      <Segment>
        <Button content="Upload" onClick={upload} />
        <Button content="Download" onClick={download} />
      </Segment>
    </div>
  );
};

if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
  videoJsOptions.plugins.record.videoMimeType = 'video/webm;codecs=vp8'; // or vp9
}

export default RecordRoutine;
