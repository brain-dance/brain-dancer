import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getSingleRoutine} from '../store';

const Coreo = props => {
  const routineId = props.match.params.id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSingleRoutine(routineId));
  }, []);

  return (
    <div id="coreo">
      {/* <Video /> */}
      {/* <Submissions /> */}
      {/* <Assignments /> */}
    </div>
  );
};

export default Coreo;
