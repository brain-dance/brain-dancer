import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getSingleRoutine} from '../store';
import {Button} from 'semantic-ui-react';

const Choreo = props => {
  const routineId = props.match.params.routineId;
  const teamId = props.match.params.teamId;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSingleRoutine(routineId));
  }, []);

  // need team to be pulled from state, to
  // get role from singleRoutine
  // role will determine if 'record a practice' button shows up

  return (
    <div id="choreo">
      <p>Choreo!</p>
      <p>View previously recorded routine + submitted practices here</p>
      <p>
        Team ID: {teamId} Routine ID: {routineId}
      </p>
      <Button
        primary
        as={Link}
        to={`/team/${props.team.id}/routine/${routineId}/add`}
        floated="right"
      >
        <Icon name="add" />
        <Icon name="record" />
      </Button>
      {/* <Video /> */}
      {/* <Submissions /> */}
      {/* <Assignments /> */}
    </div>
  );
};

export default withRouter(Choreo);
