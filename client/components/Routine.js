import React from 'react';
import {withRouter} from 'react-router-dom';

import {Link} from 'react-router-dom';

const Routine = props => {
  const {routine} = props;
  const teamId = props.match.params.teamId || routine.teamId;

  // const handleClick = id => {
  //   props.history.push(`/routines/${id}`);
  // };

  return (
    // <div className="routine-card" onClick={() => handleClick(routine.id)}>
    <Link to={`/team/${teamId}/routine/${routine.id}`}>
      <div className="routine-card">
        <p>{routine.title}</p>
      </div>
    </Link>
  );
};

export default withRouter(Routine);
