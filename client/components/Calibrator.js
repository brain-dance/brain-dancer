import React, {useEffect} from 'react';
import videojs from 'video.js';

import webrtc_adapter from 'webrtc-adapter';
import rec from 'videojs-record/dist/videojs.record.js';
import 'video.js/dist/video-js.css';

const Calibrator = props => {
  let videoPlayer = React.createRef();

  const options = {
    controls: true,
    width: 320,
    height: 240,
    fluid: false,
    controlBar: {
      volumePanel: false,
      fullscreenToggle: false
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
    player.on('deviceError', function() {
      console.warn('device error:', player.deviceErrorCode);
    });
    player.on('error', function(element, error) {
      console.error(error);
    });
    // snapshot is available
    player.on('finishRecord', function() {
      // the blob object contains the image data that
      // can be downloaded by the user, stored on server etc.
      console.log('snapshot ready: ', player.recordedData);
    });
    player.on('retry', function() {
      console.log('retry');
    });
  }, []);

  return <video id="myImage" ref={node => (videoPlayer = node)} />;
};

export default Calibrator;
