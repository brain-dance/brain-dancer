import React, {useEffect, useState, useRef} from 'react';
import videojs from 'video.js';

import webrtc_adapter from 'webrtc-adapter';
import 'videojs-record/dist/videojs.record.js';

import 'video.js/dist/video-js.css';
import 'video.js/dist/video-js.min.css';
import 'videojs-record/dist/css/videojs.record.css';
import 'videojs-record/dist/css/videojs.record.min.css';

import {Button, Image, Header} from 'semantic-ui-react';

import {stopWebcam} from '../../frontUtils/workarounds';

import PropTypes from 'prop-types';

const Calibrator = props => {
  const [camera, setCamera] = useState({});
  const [count, setCount] = useState(0);
  const videoNode = useRef(null);

  const options = {
    controls: true,
    width: 640,
    height: 480,
    fluid: false,
    controlBar: {
      volumePanel: false,
      fullscreenToggle: false,
      deviceButton: false,
      recordIndicator: false,
      cameraButton: false
    },
    plugins: {
      record: {
        image: true,
        debug: true
      }
    }
  };

  useEffect(() => {
    const player = videojs(videoNode.current, options, () => {
      let msg =
        'Using video.js ' +
        videojs.VERSION +
        ' with videojs-record ' +
        videojs.getPluginVersion('record');
      videojs.log(msg);
    });

    // error handling
    player.on('deviceError', function() {
      console.warn('device error:', player.deviceErrorCode);
    });
    player.on('error', function(element, error) {
      console.error(error);
    });

    // snapshot is available
    player.on('finishRecord', function() {
      props.setCalibration(player.recordedData);
    });

    player.record().getDevice();
    setCamera(player);

    return () => {
      stopWebcam(videoNode.current);
    };
  }, []);

  const handleCapture = () => {
    let i = 5;
    const countdown = setInterval(() => {
      if (i < 9) setCount(i);
      i++;
      if (i === 10) {
        camera.record().start();

        setCount(0);
        clearInterval(countdown);
      }
    }, 600);
  };

  return (
    <div id="calibrator">
      <video
        id="myImage"
        ref={videoNode}
        className="video-js vjs-default-skin"
      />
      <div>
        <Image src="/calibrate-guide.png" size="medium" rounded />
        <Header as="h5">Calibration</Header>
        <p>Make sure your entire body fits in the frame.</p>
        <Button type="button" onClick={handleCapture} color="blue">
          Take Picture {count !== 0 && <div>{count}</div>}
        </Button>
      </div>
    </div>
  );
};

Calibrator.propTypes = {
  setCalibration: PropTypes.func
};

export default Calibrator;
