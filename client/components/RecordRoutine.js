import React from 'react';

const RecordRoutine = function(props) {
  return (
    <div>
      <video id="video" autoPlay className="video-js vjs-default-skin">
        <p className="vjs-no-js">
          To view this video please enable JavaScript, or consider upgrading to
          a web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video.
          </a>
        </p>
      </video>
      <canvas id="output"></canvas>
    </div>
  );
};
export default RecordRoutine;
