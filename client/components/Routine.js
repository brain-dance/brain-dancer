import React from 'react';
import {withRouter} from 'react-router-dom';

const Routine = props => {
  const {routine} = props;

  const handleClick = id => {
    props.history.push(`/routines/${id}`);
  };

  return (
    <div className="routine-card" onClick={() => handleClick(routine.id)}>
      <h2>{routine.title}</h2>
    </div>
  );
};

export default withRouter(Routine);
