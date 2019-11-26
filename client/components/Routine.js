import React from 'react';
import {withRouter} from 'react-router-dom';

const Routine = props => {
  const {routine} = props;

  const handleClick = id => {
    props.history.push(`/routines/${id}`);
  };

  return (
    <div className="routine-card" onClick={() => handleClick(routine.id)}>
      <p>{routine.title}</p>
    </div>
  );
};

export default withRouter(Routine);
