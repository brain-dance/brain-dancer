import React from 'react';
import {withRouter} from 'react-router-dom';
import {Routines} from './index';
import Members from './Members';

const Team = props => {
  const team = props.team;
  // const dispatch = useDispatch();

  return (
    <div id="team">
      <h1>{team.name}</h1>
      <Routines routines={team.routines} />
      <Members members={team.members} />
    </div>
  );
};

export default withRouter(Team);
