import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getSingleRoutine} from '../store';

const Choreo = props => {
  const routineId = props.match.params.id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSingleRoutine(routineId));
  }, []);

  return (
    <div id="choreo">
      {/* <Video /> */}
      {/* <Submissions /> */}
      {/* <Assignments /> */}
    </div>
  );
};

export default Choreo;
