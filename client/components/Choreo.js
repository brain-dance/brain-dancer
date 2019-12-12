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

  const [isPlaying, setIsPlaying] = useState(false);

  //set up video
  useEffect(() => {
    playbackPlayer = videojs(playback.current, {
      muted: true,
      width: 640,
      height: 480,
      playbackRates: [0.5, 1, 1.5, 2]
    });

    playbackPlayer.on('ended', () => {
      playback.current.currentTime = 0;
      setIsPlaying(false);
    });
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

  let choreographer = '';
  if (routine.user) {
    choreographer = routine.user.name;
  }
  return (
    <Segment id="choreo">
      <Modal open={modalOpen} dimmer="inverted">
        <Modal.Content>
          <AssignRoutine setModal={setModal} members={members} />
        </Modal.Content>
      </Modal>

      <div id="buttons">
        <Button color="blue" as={Link} to={`/team/${teamId}`} floated="left">
          <Icon name="backward" /> Team
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
      </div>
      <div id="video-display">
        <video id="routine" ref={playback} className="video-js">
          {thisRoutine && <source src={thisRoutine} type="video/mp4" />}
        </video>
        <div className="hover-controls">
          <Button>
            {!isPlaying ? (
              <Icon
                name="play"
                size="massive"
                onClick={() => {
                  setIsPlaying(true);
                  playback.current.play();
                }}
              />
            ) : (
              <Icon
                name="undo alternate"
                size="massive"
                onClick={() => {
                  playback.current.currentTime = 0;
                }}
              />
            )}
          </Button>
        </div>
      </div>
      <div id="video-info">
        <h2>{routine.title}</h2>
        <h2>{choreographer}</h2>
      </div>
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
