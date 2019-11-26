import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Routines, Members} from './index';
import {Header, Button, Icon} from 'semantic-ui-react';

const Team = props => {
  const team = props.team;
  const myRole = team.role;
  return (
    <div id="team">
      <Header as="h1">
        {team.name}{' '}
        {myRole === 'choreographer' && (
          <Button
            primary
            as={Link}
            to={`/team/${props.team.id}/add`}
            floated="right"
          >
            <Icon name="add" />
            <Icon name="record" />
          </Button>
        )}
      </Header>

      <Routines routines={team.routines} />
      <Members members={team.members} />
    </div>
  );
};

export default withRouter(Team);
