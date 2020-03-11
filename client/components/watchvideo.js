import React from 'react';
import {getSingleRoutine} from '../store';
import VideoPlayer from 'react-video-js-player';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import videoJsOptions from '../../utils/videoJsOptions';
class WatchVideo extends React.Component {
  componentDidMount() {
    //using the generic name fetch video b/c we can recycle for a non-routine I think quite easily
    this.props.fetchVideo(this.props.match.params.id);
  }
  render() {
    if (this.props.singleVideo.url) {
      return (
        <div>
          <VideoPlayer
            controls={true}
            src={this.props.singleVideo.url}
            width={`${videoJsOptions.width}`}
            height={`${videoJsOptions.height}`}
          />
        </div>
      );
    }
    return <div>No URL YET</div>;
  }
}

const mapState = state => ({
  singleVideo: state.singleRoutine
});
const mapDispatch = dispatch => ({
  fetchVideo: id => dispatch(getSingleRoutine(id))
});

export const WatchRoutine = withRouter(
  connect(mapState, mapDispatch)(WatchVideo)
);

//Thought - do we want users to be able to define video resolution?
//Else, do we want to know the video resolution and scale it, or keep const width, height?
//Looks like the way to do that involves db stuff not currently set up - ask at next standup
/*



                Later stuff:
                onReady={this.onPlayerReady.bind(this)}
                    onPlay={this.onVideoPlay.bind(this)}
                    onPause={this.onVideoPause.bind(this)}
                    onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
                    onSeeking={this.onVideoSeeking.bind(this)}
                    onSeeked={this.onVideoSeeked.bind(this)}
                    onEnd={this.onVideoEnd.bind(this)}
            </div>

*/
