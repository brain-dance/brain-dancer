import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {getSingleRoutine, fetchUserTeams} from '../store';
import {Button, Icon} from 'semantic-ui-react';

import videojs from 'video.js';
import 'webrtc-adapter';

const Choreo = props => {
  const routineId = props.match.params.routineId;
  const teamId = props.match.params.teamId;

  const dispatch = useDispatch();

  const thisRoutine = useSelector(state => state.singleRoutine.url);

  const teamInfo = useSelector(state => state.teams);
  // const role = teamInfo.filter(team => team.id === +teamId)[0].role;

  let playback;
  let playbackPlayer;

  useEffect(() => {
    dispatch(fetchUserTeams());
    playbackPlayer = videojs(
      playback,
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
    dispatch(getSingleRoutine(routineId));
  }, []);

  return (
    <div id="choreo">
      <p>
        Choreo!
        {/* {role === 'dancer' && ( */}
        <Button
          primary
          as={Link}
          to={`/team/${teamId}/routine/${routineId}/add`}
          floated="right"
        >
          <Icon name="add" />
          <Icon name="record" />
        </Button>
        {/* )} */}
      </p>
      <p>View previously recorded routine + submitted practices here</p>
      <p>
        Team ID: {teamId} Routine ID: {routineId}
      </p>
      <video
        id="routine"
        ref={node => (playback = node)}
        controls={true}
        className="video-js"
      >
        {thisRoutine && <source src={thisRoutine} type="video/mp4" />}
      </video>
      {/* <Video /> */}
      {/* <Submissions /> */}
      {/* <Assignments /> */}
    </div>
  );
};

export default withRouter(Choreo);
