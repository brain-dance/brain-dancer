import React from 'react';
import {Routine} from './index';
import {Header, Segment} from 'semantic-ui-react';
import PropTypes from 'prop-types';

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

Routines.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    imgUrl: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string
  }),
  routines: PropTypes.array,
  members: PropTypes.array
};

export default Routines;
