import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {setSingleRoutine, getSingleRoutine} from '../store';
import {
  Card,
  Segment,
  Header,
  Button,
  Icon,
  Divider,
  Modal
} from 'semantic-ui-react';

import videojs from 'video.js';
import 'webrtc-adapter';
import {stopWebcam} from '../../frontUtils/workarounds';
import AssignRoutine from './AssignRoutine';

const Choreo = props => {
  const routineId = props.match.params.routineId;
  const teamId = props.match.params.teamId;

  const dispatch = useDispatch();

  const thisRoutine = useSelector(state => state.singleRoutine.url);
  const routine = useSelector(state => state.singleRoutine);
  const teamInfo = useSelector(state => state.teams);

  const playback = useRef(null);
  let playbackPlayer;
  let members = [];
  let role;

  //set up video
  useEffect(() => {
    playbackPlayer = videojs(
      playback.current,
      {
        controls: true,
        width: 640,
        height: 480,
        playbackRates: [0.5, 1, 1.5, 2]
      },
      () => {
        videojs.log('playback screen is live!');
      }
    );
    playbackPlayer.addClass('vjs-waiting');
    dispatch(getSingleRoutine(routineId));

    return () => {
      dispatch(setSingleRoutine({}));
      playbackPlayer.dispose();
    };
  }, []);

  //set up assignment modal
  const [modalOpen, setModal] = useState(false);

  if (teamInfo.length > 0 && routine.teamId) {
    members = teamInfo.find(team => team.id === routine.teamId).members;
    role = teamInfo.find(team => team.id === routine.teamId).role;
  }
  return (
    <Segment id="choreo">
      <div>
        <Modal open={modalOpen} dimmer="inverted">
          <Modal.Content>
            <AssignRoutine setModal={setModal} members={members} />
          </Modal.Content>
        </Modal>
      </div>
      <Header as="h2">
        <Button color="blue" as={Link} to={`/team/${teamId}`} floated="left">
          <Icon name="backward" /> Back to Team
        </Button>{' '}
        <Button
          color="orange"
          as={Link}
          to={`/team/${teamId}/routine/${routineId}/add`}
          floated="right"
        >
          <Icon name="add" />
          <Icon name="record" />
        </Button>
        {role === 'choreographer' && (
          <Button color="blue" onClick={() => setModal(true)} floated="right">
            <Icon name="add" />
            <Icon name="user plus" />
          </Button>
        )}
      </Header>
      <Divider />
      <Header as="h2">{routine.title}</Header>
      <video id="routine" ref={playback} controls={true} className="video-js">
        {thisRoutine && <source src={thisRoutine} type="video/mp4" />}
      </video>
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
              </Card.Content>
            </Card>
          );
        })}
    </Segment>
  );
};

export default withRouter(Choreo);
