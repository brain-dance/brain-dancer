import React from 'react';
import {Routine} from './index';
import {Header, Segment} from 'semantic-ui-react';

const Routines = props => {
  const routines = props.routines || [];
  const team = props.team;

  return (
    <Segment basic>
      {!routines.length ? (
        <div>
          Welcome! There are no routines yet for this team. Reach out to your
          choreographer for assignments.
        </div>
      ) : (
        <div id="routines">
          {routines.map(routine => (
            <Routine key={routine.id} routine={routine} team={team} />
          ))}
        </div>
      )}
    </Segment>
  );
};

export default Routines;
