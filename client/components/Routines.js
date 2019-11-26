import React from 'react';
import {Routine} from './index';
import {Header} from 'semantic-ui-react';

const Routines = props => {
  const routines = props.routines || [];

  return (
    <div id="routines">
      <Header as="h2">Routines</Header>
      {routines.map(routine => (
        <Routine key={routine.id} routine={routine} />
      ))}
    </div>
  );
};

export default Routines;
