import React from 'react';

const Routine = props => {
  const {routine} = props;

  return <h2>{routine.title}</h2>;
};

export default Routine;
