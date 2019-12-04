import React from 'react';
import {Routine} from './index';
import {Header, Segment} from 'semantic-ui-react';

const Routines = props => {
  const routines = props.routines || [];
  const team = props.team;

  return (
    <Segment basic id="routines" color="orange">
      <Header as="h2">Routines</Header>
      {!routines.length ? (
        <div>
          There are no routines yet for this team. Reach out to your
          choreographer for assignments.
        </div>
      ) : (
        <div>
          {routines.map(routine => (
            <Routine key={routine.id} routine={routine} team={team} />
          ))}
        </div>
      )}
    </Segment>
  );
};

export default Routines;
