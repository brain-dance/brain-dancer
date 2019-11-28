import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {setSingleRoutine, getSingleRoutine} from '../store';
import {Card, Segment, Header, Button, Icon, Divider} from 'semantic-ui-react';

import videojs from 'video.js';
import 'webrtc-adapter';

const Choreo = props => {
  const routineId = props.match.params.routineId;
  const teamId = props.match.params.teamId;

  const dispatch = useDispatch();

  const thisRoutine = useSelector(state => state.singleRoutine.url);
  const routine = useSelector(state => state.singleRoutine);
  const teamInfo = useSelector(state => state.teams);
  // const role = teamInfo.filter(team => team.id === +teamId)[0].role;

  let playback;
  let playbackPlayer;

  useEffect(() => {
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
    playbackPlayer.addClass('vjs-waiting');
    dispatch(getSingleRoutine(routineId));

    return () => dispatch(setSingleRoutine({}));
  }, []);

  return (
    <Segment id="choreo">
      <Header as="h2">
        <Button color="blue" as={Link} to={`/team/${teamId}`} floated="left">
          <Icon name="backward" /> Back to Team
        </Button>{' '}
        {/* {role === 'dancer' && ( */}
        <Button
          color="orange"
          as={Link}
          to={`/team/${teamId}/routine/${routineId}/add`}
          floated="right"
        >
          <Icon name="add" />
          <Icon name="record" />
        </Button>
        {/* )} */}
      </Header>
      <Divider />
      <Header as="h2">{routine.title}</Header>
      <video
        id="routine"
        ref={node => (playback = node)}
        controls={true}
        className="video-js"
      >
        {thisRoutine && <source src={thisRoutine} type="video/mp4" />}
      </video>
      {/* <Submissions /> */}
      {/* <Assignments /> */}
      <Header as="h3">Practice Submissions</Header>
      {routine.practices &&
        routine.practices.map(practice => {
          return (
            <Card key={practice.id}>
              <Card.Header as="h4">{practice.title} (title)</Card.Header>
              <Card.Content>
                <p>
                  (question to devs - include video here? link to a new
                  component to play video??)
                </p>
                {/* <video id={practice.id}>
                <source
                  src={practice.url}
                  type="video/mp4"
                  controls={true}
                  className="video-js"
                />
              </video> */}
              </Card.Content>
            </Card>
          );
        })}
    </Segment>
  );
};

export default withRouter(Choreo);
