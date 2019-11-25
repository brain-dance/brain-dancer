import React from 'react';
import {Routine} from './index';

const Routines = props => {
  const routines = props.routines || [];

  return (
    <div id="routines">
      <h1>Routines</h1>
      {routines.map(routine => (
        <Routine key={routine.id} routine={routine} />
      ))}
    </div>
  );
};

export default Routines;
