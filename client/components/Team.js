import React from 'react';
import {withRouter} from 'react-router-dom';
import {Routines, Members} from './index';
import {Header} from 'semantic-ui-react';

const Team = props => {
  const team = props.team;

  return (
    <div id="team">
      <Header as="h1">{team.name}</Header>
      <Routines routines={team.routines} />
      <Members members={team.members} />
    </div>
  );
};

export default withRouter(Team);
