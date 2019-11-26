import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getSingleRoutine} from '../store';

const Choreo = props => {
  const routineId = props.match.params.routineId;
  const teamId = props.match.params.teamId;
  const dispatch = useDispatch();

  console.log('teamId', teamId, routineId);
  useEffect(() => {
    dispatch(getSingleRoutine(routineId));
  }, []);

  return (
    <div id="choreo">
      <p>Choreo!</p>
      <p>View previously recorded routine + submitted practices here</p>
      <p>
        Team ID: {teamId} Routine ID: {routineId}
      </p>
      {/* <Video /> */}
      {/* <Submissions /> */}
      {/* <Assignments /> */}
    </div>
  );
};

export default withRouter(Choreo);
