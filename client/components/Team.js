import React from 'react';
import {withRouter} from 'react-router-dom';
import {Routines, Members} from './index';

const Team = props => {
  const team = props.team;

  return (
    <div id="team">
      <h1>{team.name}</h1>
      <Routines routines={team.routines} />
      <Members members={team.members} />
    </div>
  );
};

export default withRouter(Team);
