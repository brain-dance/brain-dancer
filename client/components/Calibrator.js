import React, {useEffect, useState} from 'react';
import videojs from 'video.js';

import webrtc_adapter from 'webrtc-adapter';
import 'videojs-record/dist/videojs.record.js';

import 'video.js/dist/video-js.css';
import 'video.js/dist/video-js.min.css';
import 'videojs-record/dist/css/videojs.record.css';
import 'videojs-record/dist/css/videojs.record.min.css';

const Calibrator = props => {
  const [camera, setCamera] = useState({});
  const [count, setCount] = useState(0);
  let videoPlayer = React.createRef();

  const options = {
    controls: true,
    width: 320,
    height: 240,
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
    const player = videojs(videoPlayer, options, () => {
      let msg =
        'Using video.js ' +
        videojs.VERSION +
        ' with videojs-record ' +
        videojs.getPluginVersion('record');
      videojs.log(msg);
    });

    // error handling
    console.log(player);
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

    player.on('retry', function() {
      console.log('retry');
    });
    player.record().getDevice();
    setCamera(player);
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
    }, 800);
  };

  return (
    <div id="calibrator">
      <video
        id="myImage"
        ref={node => (videoPlayer = node)}
        className="video-js vjs-default-skin"
      />
      <button type="button" onClick={handleCapture}>
        Take Picture
      </button>
      {count !== 0 && <div>{count}</div>}
    </div>
  );
};

export default Calibrator;
