import React from 'react';
import {Routine} from './index';

const Routines = props => {
  const routines = props.routines || [];

  return routines.map(routine => (
    <Routine key={routine.id} routine={routine} />
  ));
};

export default Routines;
