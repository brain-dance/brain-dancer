import React from 'react';
import VideoPlayer from 'react-video-js-player';

const VideoAttemptViewer = () => {
  const videoPlayer = {};
  const state = {
    video: {
      //WHAT CAN I PULL FROM BLOB?
      src:
        'https://res.cloudinary.com/braindance/video/upload/v1574452783/iedfpxyyuog4h0b1rjbj.mkv',
      poster:
        'https://cdn3.vectorstock.com/i/1000x1000/32/32/black-ink-drop-and-splash-vector-16933232.jpg'
    }
  };

  const onPlayerReady = player => {
    console.log('Player is ready: ', player);
    videoPlayer = player;
  };

  const onVideoPlay = duration => {
    console.log('Video played at: ', duration);
  };

  const onVideoPause = duration => {
    console.log('Video paused at: ', duration);
  };

  // onVideoTimeUpdate(duration) {
  //   console.log('Time updated: ', duration);
  // }

  // onVideoSeeking(duration) {
  //   console.log('Video seeking: ', duration);
  // }

  // onVideoSeeked(from, to) {
  //   console.log(`Video seeked from ${from} to ${to}`);
  // }

  // onVideoEnd() {
  //   console.log('Video ended');
  // }

  // render() {
  return (
    <div>
      <VideoPlayer
        controls={true}
        src={state.video.src}
        poster={state.video.poster}
        width="720"
        height="420"
        onReady={onPlayerReady}
        onPlay={onVideoPlay}
        onPause={onVideoPause}
        // onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
        // onSeeking={this.onVideoSeeking.bind(this)}
        // onSeeked={this.onVideoSeeked.bind(this)}
        // onEnd={this.onVideoEnd.bind(this)}
      />
    </div>
  );
};

export default VideoAttemptViewer;
