import React from 'react';
import {Player} from 'video-react';

const VideoPlayer = props => {
  console.log(props);
  const {videoUrl} = props;
  return <Player playsInline poster="/assets/poster.png" src={videoUrl} />;
};

export default VideoPlayer;
