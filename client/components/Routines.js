import React from 'react';
import {Routine} from './index';
import {Header, Segment} from 'semantic-ui-react';

const Routines = props => {
  const routines = props.routines || [];

  return (
    <Segment basic id="routines" color="orange">
      <Header as="h2">Routines</Header>
      {routines.map(routine => (
        <Routine key={routine.id} routine={routine} />
      ))}
    </Segment>
  );
};

export default Routines;
